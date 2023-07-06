import { resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { CHALLENGE_PATH } from "../constants/path";

const useLoadChallenge = (slug: string | undefined) => {
  const [starter, setstarter] = useState("");
  const [json, setJson] = useState("");
  const [description, setdescription] = useState("");
  const [test, settest] = useState("");

  const loadFiles = async () => {
    if (slug) {
      const base = `${CHALLENGE_PATH}/${slug}`;
      const starterPath = await resolveResource(`${base}/starter.js`);
      const jsonPath = await resolveResource(`${base}/challenge.json`);
      const descriptionPath = await resolveResource(`${base}/description.md`);
      const testPath = await resolveResource(`${base}/test.js`);
      invoke("load_challenge", {
        starterPath,
        jsonPath,
        descriptionPath,
        testPath,
      })
        .then((response) => {
          const result = response as { [key: string]: string };
          setstarter(result.starter);
          settest(result.test);
          setdescription(result.description);
          setJson(result.json);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return { starter, json, description, test };
};

export default useLoadChallenge;
