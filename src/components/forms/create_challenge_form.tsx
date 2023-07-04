import Input from "../common/input";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { ChangeEvent, FormEvent, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { extractFunctionInfo } from "../../helpers/strings";
import { FaPlus, FaTrash } from "react-icons/fa";
import { formatFormToObject } from "../../helpers/form";

const CreateChallengeForm = () => {
  const [starter, setstarter] = useState("");
  const [test, settest] = useState("");
  const [errorInScript, seterrorInScript] = useState(false);
  const [description, setdescription] = useState<string | undefined>("");
  const [testCount, settestCount] = useState(0);
  const [params, setparams] = useState<string[]>([]);

  const incrementTestCount = () => {
    settestCount(() => testCount + 1);
  };

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
      }
    } catch (error) {
      seterrorInScript(true);
      console.log(error);
    }
  };

  const handleContent = (value?: string | undefined) => {
    setdescription(value);
  };

  const generateChallenge = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formatFormToObject(formData));
  };

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
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            const title = e.currentTarget.value;
            const value = `
describe("#TITLE", () => {
  it("#TITLE", () => {
    #TESTS
  });
});
            `;

            settest(value.replaceAll("#TITLE", title));
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
              <button type="button" onClick={incrementTestCount}>
                <FaPlus />
              </button>
            </div>
            <TestBatteries params={params} count={testCount} />
          </div>
          <div className="flex-1">
            <CodeMirror
              className="w-full h-full text-lg"
              value={test}
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

const TestBatteries = ({
  count,
  params,
}: {
  count: number;
  params: string[];
}) => {
  return (
    <ul>
      {Array.from(Array(count).keys()).map((test, index) => (
        <TestBatteryItem params={params} key={`test_battery_${index}`} />
      ))}
    </ul>
  );
};

const TestBatteryItem = ({ params }: { params: string[] }) => {
  return (
    <li className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        {params.map((param, index) => (
          <Input name={`param_${index}`} label={param} />
        ))}
        <Input name="result" label="Expected result" />
      </div>
      <button>
        <FaTrash />
      </button>
    </li>
  );
};

export default CreateChallengeForm;
