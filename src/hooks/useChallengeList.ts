import { resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { CHALLENGE_PATH } from "../constants/path";

const useChallengeList = () => {
  const [challenges, setchallenges] = useState<string[]>([]);
  const getChallengePath = async () => {
    const challengePath = await resolveResource(CHALLENGE_PATH);
    invoke("list_challenges", { challengePath })
      .then((response) => {
        setchallenges(response as string[]);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getChallengePath();
  }, []);
  return { challenges };
};

export default useChallengeList;
