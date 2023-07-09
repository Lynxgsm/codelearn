import Input from "../common/input";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { extractFunctionInfo, slugify } from "../../helpers/strings";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSnapshot } from "valtio";
import { actions, store } from "../../store";
import { invoke } from "@tauri-apps/api/tauri";
import { resolveResource } from "@tauri-apps/api/path";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/api/dialog";

const CreateChallengeForm = () => {
  const [starter, setstarter] = useState("");
  const [errorInScript, seterrorInScript] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState<string | undefined>("");
  const [params, setparams] = useState<string[]>([]);
  const [functionName, setfunctionName] = useState("");

  const { addTest, setTestString } = store.challenge.actions;
  const { testString } = useSnapshot(store.challenge.states);

  const handleStarterCodeInput = (value: string) => {
    seterrorInScript(false);
    setstarter(value);
  };

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
      seterrorInScript(true);
      console.log(error);
    }
  };

  const handleContent = (value?: string | undefined) => {
    setdescription(value);
  };

  const generateChallenge = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filePath = await open({
      directory: true,
    });

    const slug = slugify(title);
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
      descriptionContent: description,
      jsonPath,
      jsonContent: JSON.stringify({
        title,
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

  const eventListener = async () => {
    await listen("challenge_created", (event) => {
      console.log(event);
    });
  };

  useEffect(() => {
    eventListener();
  }, []);

  return (
    <form
      action=""
      onSubmit={generateChallenge}
      className="flex flex-col gap-4"
    >
      <div className="flex-1 flex flex-col gap-4">
        <Input
          name="title"
          type="text"
          onChange={(e) => settitle(e.currentTarget.value)}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            const title = e.currentTarget.value;
            setTestString(testString.replaceAll("#TITLE", title));
          }}
          label="Titre"
          required
        />
        <div>
          <label htmlFor="">Description</label>
          <MDEditor
            onChange={handleContent}
            value={description}
            aria-required={true}
            className="mt-2"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <label htmlFor="">Code de départ</label>
          <CodeMirror
            className="w-full h-full text-lg"
            value={starter}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            onChange={handleStarterCodeInput}
            onBlur={() => {
              evaluateJavaScriptCode(starter);
            }}
            theme={"dark"}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <label htmlFor="">
                Tests{" "}
                {errorInScript && (
                  <span className="text-sm text-red-500">
                    (Please correct your javascript function before making
                    tests)
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
      </div>
      <button>Create challenge</button>
    </form>
  );
};

const TestBatteries = () => {
  const { tests, testsWithValue, testString } = useSnapshot(
    store.challenge.states
  );
  const { setTestString } = store.challenge.actions;
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

          setTestString(
            testString.replace("#TESTS", generatedString.join("\n"))
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
  params: string[];
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

export default CreateChallengeForm;
