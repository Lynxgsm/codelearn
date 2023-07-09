import { useParams } from "react-router-dom";
import CodeDisplay from "../components/code_display";
import SubjectDisplay from "../components/subject_display";
import useLoadChallenge from "../hooks/useLoadChallenge";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";

const ChallengePage = () => {
  const { slug } = useParams();
  const [loadTest, setloadTest] = useState(false);
  const { starter, description, test } = useLoadChallenge(slug);
  const { writtenCode } = useSnapshot(store.challenge);

  const launchTest = async () => {
    const templatePath = await resolveResource("../dist/template.html");
    const testPath = await resolveResource("../dist/test.html");

    setloadTest(false);
    invoke("create_test_file", {
      templatePath,
      testPath,
      code: writtenCode,
      test,
    });

    setTimeout(() => {
      setloadTest(true);
    }, 1000);
  };

  return (
    <div className="w-full p-8">
      <p>Sum of two numbers</p>
      <div className="flex gap-4 min-h-[80vh] flex-grow-1">
        <div className="flex-1">
          <SubjectDisplay file={description} />
        </div>
        <div className="flex flex-col gap-10 flex-1">
          <div className="flex-1">
            <div className="bg-neutral-700 text-white py-1 px-3 rounded-tl-md rounded-tr-md">
              <p>Code</p>
            </div>
            <CodeDisplay initial={starter} />
          </div>
          {loadTest ? (
            <div className="flex-1">
              <iframe
                className="w-full h-full"
                src="http://127.0.0.1:8000/static/test.html"
              />
            </div>
          ) : (
            <p>Waiting for test to run</p>
          )}
          <button
            onClick={launchTest}
            className="bg-blue-500 text-white py-2 rounded-md"
          >
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
