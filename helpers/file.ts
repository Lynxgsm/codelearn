import { CHALLENGE_PATH } from "@/constants/path";
import { Challenge } from "@/types/challenge";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, extname, resolve } from "path";

export const createDir = async (name: string) => {
  try {
    mkdirSync(name);
  } catch (error) {
    console.error(error);
  }
};

export const createFile = async (name: string, content: string) => {
  try {
    writeFileSync(name, content);
    console.log("File created successfully.");
  } catch (err) {
    console.error("Error creating file:", err);
  }
};

export const readChallengeDir = (): string[] | Error => {
  try {
    const challenges = readdirSync(CHALLENGE_PATH);
    return challenges.filter((challenge) => {
      const isDir = statSync(resolve(CHALLENGE_PATH, challenge));
      return isDir.isDirectory();
    });
  } catch (error) {
    return error as Error;
  }
};

export const readJSONFile = (directoryPath: string): Challenge | Error => {
  try {
    const files = readdirSync(directoryPath);
    let jsonFiles: Challenge | null = null;

    files.forEach((file) => {
      const filePath = join(directoryPath, file);

      // Check if the file is a JSON file
      if (extname(file) === ".json") {
        try {
          const data = readFileSync(filePath, "utf8");
          const json = JSON.parse(data);
          jsonFiles = json;
        } catch (err) {
          return err as Error;
        }
      }
    });

    if (jsonFiles) {
      return jsonFiles;
    }

    return new Error("Unable to read file");
  } catch (err) {
    return err as Error;
  }
};
