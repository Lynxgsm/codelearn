import { invoke } from "@tauri-apps/api/tauri";
import Button from "../../components/common/button";
import { actions, store } from "../../store";
import { resolveResource } from "@tauri-apps/api/path";
import { slugify } from "../../helpers/strings";
import { open } from "@tauri-apps/api/dialog";
import { FormEvent, useState } from "react";
import CodeDisplay from "../../components/code_display";
import SubjectDisplay from "../../components/subject_display";

const CreatePreview = () => {
  const { handlePrevious } = actions.stepper;
  const { testString, description, title, starterFunction, writtenCode } =
    store.challenge;

  const [loadTest, setloadTest] = useState(false);

  const launchTest = async () => {
    const templatePath = await resolveResource("../dist/template.html");
    const testPath = await resolveResource("../dist/test.html");

    setloadTest(false);
    invoke("create_test_file", {
      templatePath,
      testPath,
      code: writtenCode,
      test: testString,
    });

    setTimeout(() => {
      setloadTest(true);
    }, 100);
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
      starterContent: starterFunction, // CHANGE TO STARTER
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

  return (
    <div>
      <form onSubmit={generateChallenge}>
        <div className="flex items-center gap-4">
          <Button type="button" onClick={handlePrevious}>
            Précedent
          </Button>
          <Button variant="warning">Créer le challenge</Button>
        </div>
      </form>
      <h4 className="border-b-2 pb-4">
        Ici, vous pourrez tester votre challenge avant de l'exporter et de le
        partager
      </h4>
      <div className="w-full py-4">
        <p className="font-bold text-xl">{title}</p>
        <div className="flex gap-4 min-h-[80vh] flex-grow-1">
          <div className="flex-1">
            <SubjectDisplay file={description} />
            <TestDisplay />
          </div>
          <div className="flex flex-col gap-10 flex-1">
            <div className="flex-1">
              <div className="bg-neutral-700 text-white py-1 px-3 rounded-tl-md rounded-tr-md">
                <p>Code</p>
              </div>
              <CodeDisplay initial={starterFunction} />
            </div>
            {loadTest ? (
              <div className="flex-1">
                <iframe
                  className="w-full h-full"
                  src="http://127.0.0.1:8000/static/test.html"
                />
              </div>
            ) : (
              <p>⚡️ Les tests seront executés ici</p>
            )}
            <Button onClick={launchTest}>Tester mon code</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestDisplay = () => {
  const { testsWithValue } = store.challenge;
  return (
    <div className="py-8">
      <h4 className="text-lg font-medium">Tests à faire</h4>
      <ul>
        {testsWithValue.map(({ functionName, params, result }, index) => {
          return (
            <li key={`test_with_values_${index}`} className="my-2">
              <CodeDisplay
                initial={`${functionName}(${Object.keys(params).join(
                  ","
                )})=${result}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CreatePreview;
