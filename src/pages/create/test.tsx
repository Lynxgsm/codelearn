import CodeMirror from "@uiw/react-codemirror";
import { ChangeEvent, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { extractFunctionInfo } from "../../helpers/strings";
import { useSnapshot } from "valtio";
import { actions, store } from "../../store";
import { FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../components/common/input";
import Button from "../../components/common/button";
import { TestWithResult } from "../../types/Test";

const CreateTest = () => {
  const [errorInScript, seterrorInScript] = useState("");
  const [params, setparams] = useState<string[]>([]);
  const [functionName, setfunctionName] = useState("");

  const handleStarterCodeInput = (value: string) => {
    seterrorInScript("");
    store.challenge.starterFunction = value;
  };

  const { testString, starterFunction, testsWithValue } = useSnapshot(
    store.challenge
  );
  const { addTest } = actions.challenge;
  const { handlePrevious, handleNext } = actions.stepper;
  const evaluateJavaScriptCode = (text: string) => {
    try {
      eval(text);
      const result = extractFunctionInfo(text);

      if (result?.params) {
        setparams(result.params.split(","));
        setfunctionName(result.functionName);
        if (testsWithValue.length === 0) {
          addTest({
            functionName: result.functionName,
            params: result.params.split(",").reduce((a, c) => {
              a[c] = "";
              return a;
            }, {} as { [key: string]: string }),
            description: "",
            id: `test_string_${store.challenge.testsWithValue.length + 1}`,
            result: "",
          });
        }
      }
    } catch (error) {
      const _err = error as Error;
      seterrorInScript(`${_err.message} - ${_err.name}`);
      console.log(error as string);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      <div>
        <label htmlFor="">Code de départ</label>
        <CodeMirror
          className="w-full h-full text-lg"
          autoFocus
          value={starterFunction}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={handleStarterCodeInput}
          onBlur={() => {
            evaluateJavaScriptCode(starterFunction);
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
                  params: params.reduce((a, c) => {
                    a[c] = "";
                    return a;
                  }, {} as { [key: string]: string }),
                  description: "",
                  id: `test_string_${
                    store.challenge.testsWithValue.length + 1
                  }`,
                  result: "",
                });
              }}
            >
              <FaPlus />
            </button>
          </div>
          <TestBatteries />
        </div>
        <div className="flex-1">
          // HIDE THIS ON PRODUCTION
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
  const { testsWithValue } = useSnapshot(store.challenge);
  const { generateTestString, modifyTestString } = actions.challenge;
  return (
    <>
      <ul>
        {testsWithValue.map((test) => (
          <TestBatteryItem key={test.id} {...test} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          modifyTestString();
          generateTestString();
        }}
      >
        Generate test
      </button>
    </>
  );
};

const TestBatteryItem = ({ functionName, params, id }: TestWithResult) => {
  const [tests, settests] = useState(
    Object.keys(params).reduce((a, c) => {
      a[c] = "";
      return a;
    }, {} as { [key: string]: string })
  );
  const [description, setdescription] = useState("");
  const [expectedResult, setExpectedResult] = useState("");

  const { setTestsWithValue } = actions.challenge;

  return (
    <li className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        <Input
          name="description"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const description = e.currentTarget.value;
            setdescription(description);
            settests((t) => {
              t["description"] = description;
              return t;
            });

            setTestsWithValue({
              id,
              functionName,
              params: tests,
              result: expectedResult,
              description,
            });
          }}
          label="Description"
        />
        {Object.keys(params).map((param, index) => (
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

              setTestsWithValue({
                id,
                functionName,
                params: tests,
                result: expectedResult,
                description,
              });
            }}
            label={param}
          />
        ))}
        <Input
          name="result"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const result = e.currentTarget.value;

            setTestsWithValue({
              id,
              functionName,
              params: tests,
              result,
              description,
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
