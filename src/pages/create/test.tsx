import CodeMirror from "@uiw/react-codemirror";
import { ChangeEvent, FormEvent, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { extractFunctionInfo, slugify } from "../../helpers/strings";
import { useSnapshot } from "valtio";
import { actions, store } from "../../store";
import { open } from "@tauri-apps/api/dialog";
import { resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../components/common/input";
import Button from "../../components/common/button";

const CreateTest = () => {
  const [starter, setstarter] = useState("");
  const [errorInScript, seterrorInScript] = useState("");
  const [params, setparams] = useState<string[]>([]);
  const [functionName, setfunctionName] = useState("");

  const handleStarterCodeInput = (value: string) => {
    seterrorInScript("");
    setstarter(value);
  };

  const { testString } = useSnapshot(store.challenge);
  const { addTest } = actions.challenge;
  const { handlePrevious, handleNext } = actions.stepper;
  const evaluateJavaScriptCode = (text: string) => {
    try {
      eval(text);
      const result = extractFunctionInfo(text);

      if (result?.params) {
        setparams(result.params.split(","));
        setfunctionName(result.functionName);
        addTest({
          functionName: result.functionName,
          params: result.params.split(","),
        });
      }
    } catch (error) {
      const _err = error as Error;
      seterrorInScript(`${_err.message} - ${_err.name}`);
      console.log(error as string);
    }
  };

  const generateChallenge = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filePath = await open({
      directory: true,
    });

    const slug = slugify("title");
    const zipPath = `${filePath}/${slug}.zip`;
    const challengePath = await resolveResource(`../dist/challenges/${slug}`);
    const starterPath = await resolveResource(
      `../dist/challenges/${slug}/starter.js`
    );
    const descriptionPath = await resolveResource(
      `../dist/challenges/${slug}/description.md`
    );
    const testPath = await resolveResource(
      `../dist/challenges/${slug}/test.js`
    );
    const jsonPath = await resolveResource(
      `../dist/challenges/${slug}/challenge.json`
    );

    const data = {
      challengePath,
      testPath,
      zipPath,
      testContent: testString,
      starterPath,
      starterContent: starter,
      descriptionPath,
      descriptionContent: "description", // CHANGE TO DESCRIPTION
      jsonPath,
      jsonContent: JSON.stringify({
        title: "title", // CHANGE TO TITLE
        level: 0,
        test: "./challenge.test.js",
        description: "./description.md",
        starter: "./starter.js",
        id: slug,
        language: "js",
        author: "Lynxgsm",
      }),
    };

    invoke("generate_challenge", data);
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      <div>
        <label htmlFor="">Code de départ</label>
        <CodeMirror
          className="w-full h-full text-lg"
          autoFocus
          value={starter}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={handleStarterCodeInput}
          onBlur={() => {
            evaluateJavaScriptCode(starter);
          }}
          theme={"dark"}
        />
        {errorInScript && <p>{errorInScript}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <label htmlFor="">
              Tests{" "}
              {errorInScript && (
                <span className="text-sm text-red-500">
                  (Please correct your javascript function before making tests)
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={() => {
                addTest({
                  functionName,
                  params,
                });
              }}
            >
              <FaPlus />
            </button>
          </div>
          <TestBatteries />
        </div>
        <div className="flex-1">
          <CodeMirror
            className="w-full h-full text-lg"
            value={testString}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme={"dark"}
            aria-disabled="true"
            readOnly={true}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handlePrevious}>Revenir</Button>
        <Button onClick={handleNext}>Suivant</Button>
      </div>
    </div>
  );
};

const TestBatteries = () => {
  const { tests, testsWithValue, testString } = useSnapshot(store.challenge);
  return (
    <>
      <ul>
        {tests.map((test, index) => (
          <TestBatteryItem
            functionName={test.functionName}
            params={test.params}
            key={`${test.functionName}_${index}`}
            id={`${test.functionName}_${index}`}
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          const generatedString: string[] = [];
          testsWithValue.forEach((test) => {
            const values = Object.values(test.params).map((v) => v);
            values.pop();
            generatedString.push(
              `expect(${test.functionName}(${values.join(",")})).to.equal(${
                test.result
              });`
            );
          });

          store.challenge.testString = testString.replace(
            "#TESTS",
            generatedString.join("\n")
          );
        }}
      >
        Generate test
      </button>
    </>
  );
};

const TestBatteryItem = ({
  functionName,
  params,
  id,
}: {
  functionName: string;
  params: readonly string[];
  id: string;
}) => {
  const [tests, settests] = useState<{ [key: string]: string }>(
    params.reduce((acc, current) => {
      acc[current] = "";
      return acc;
    }, {} as { [key: string]: string })
  );

  const { setTestsWithValue } = actions.challenge;

  return (
    <li className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        {Object.keys(tests)
          .filter((test) => test !== "result")
          .map((param, index) => (
            <Input
              key={`param_input_${index}`}
              name={`param_${index}`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.currentTarget.value;
                if (value) {
                  settests((t) => {
                    t[param] = value;
                    return t;
                  });
                }
              }}
              label={param}
            />
          ))}
        <Input
          name="result"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const result = e.currentTarget.value;
            settests((t) => {
              t["result"] = result;
              return t;
            });

            setTestsWithValue({
              id,
              functionName,
              params: tests,
              result,
            });
          }}
          label="Expected result"
        />
      </div>
      <button>
        <FaTrash />
      </button>
    </li>
  );
};

export default CreateTest;
