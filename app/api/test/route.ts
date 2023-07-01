import { spawn } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import ansiRegex from "ansi-regex";

function runTest() {
  return new Promise((resolve, reject) => {
    const childProcess = spawn("npm", ["run", "test"]);

    let output = "";

    childProcess.stdout.on("data", (data) => {
      const chunk: string = data.toString();
      output += chunk.trim();
    });

    childProcess.stderr.on("data", (data) => {
      const errorChunk = data.toString();
      output += errorChunk;
      process.stderr.write(errorChunk); // Optional: Print the error in the console
    });

    childProcess.on("close", (code) => {
      let result = "";

      if (output.includes("FAIL")) {
        result = output.substring(output.indexOf("FAIL"));
      } else {
        result = output.substring(output.indexOf("PASS"));
      }

      resolve(result);
    });

    childProcess.on("error", (error) => {
      reject(error);
    });
  });
}

function removeAnsiCodes(input: string) {
  const regex = ansiRegex();
  return input.replace(regex, "");
}

export async function GET() {
  const response = (await runTest()) as string;

  return NextResponse.json({
    response: removeAnsiCodes(response),
  });
}
