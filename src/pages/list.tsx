import { extractSlugName, unslugify } from "../helpers/strings";
import useChallengeList from "../hooks/useChallengeList";
import { Link } from "react-router-dom";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { resolveResource } from "@tauri-apps/api/path";
import { CHALLENGE_PATH } from "../constants/path";
import { useState } from "react";

const ListPage = () => {
  const [loading, setloading] = useState(false);
  const importChallenge = async () => {
    setloading(true);
    const selected = await open({
      filters: [
        {
          name: "Zip",
          extensions: ["zip"],
        },
      ],
    });

    if (selected && typeof selected === "string") {
      const filename = extractSlugName(selected);
      const challengePath = await resolveResource(CHALLENGE_PATH);
      const fileExtractionPath = await resolveResource(
        `${CHALLENGE_PATH}/${filename}`
      );

      invoke("importing_challenge", {
        filePath: selected,
        challengePath,
        fileExtractionPath,
      });

      setloading(false);
    }
  };
  return (
    <section className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl">Challenges</h1>
      <div className="flex items-start gap-8">
        {loading ? <p>Loading...</p> : <ListContainer />}
        <Link
          to="/create"
          className="grid place-content-center p-8 border-2 border-dashed hover:bg-neutral-400 hover:border-solid"
        >
          Create challenge
        </Link>
        <button onClick={importChallenge}>Import challenge</button>
      </div>
    </section>
  );
};

const ListContainer = () => {
  const { challenges } = useChallengeList();
  return (
    <ul className="flex flex-col gap-2 flex-1">
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <li className="capitalize rounded-sm bg-neutral-100 p-2 hover:bg-neutral-300">
            <Link to={`/challenge/${challenge}`}>{unslugify(challenge)}</Link>
          </li>
        ))
      ) : (
        <p>
          Vous n'avez pas de challenge disponible. Vous pouvez en créer un ou en
          importer un.
        </p>
      )}
    </ul>
  );
};

export default ListPage;
