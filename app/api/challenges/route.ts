// GET LIST OF CHALLENGES

import { CHALLENGE_PATH } from "@/constants/path";
import { readChallengeDir, readJSONFile } from "@/helpers/file";
import { NextResponse } from "next/server";
import { resolve } from "path";

export async function GET() {
  // Read all json files
  const dirs = readChallengeDir();
  let jsonContent = [];

  if (dirs instanceof Array) {
    for (let i = 0; i < dirs.length; i++) {
      jsonContent.push(readJSONFile(resolve(CHALLENGE_PATH, dirs[i])));
    }
  }

  return NextResponse.json({
    data: jsonContent,
  });
}
