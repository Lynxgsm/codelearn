"use client";

import { ChangeEvent, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { resolveResource } from "@tauri-apps/api/path";

const Form = () => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [iframeTestPath, settestPath] = useState("");
  const [content, setcontent] = useState("");
  const launchTest = async () => {
    const templatePath = await resolveResource("../dist/template.html");
    const testPath = await resolveResource("../dist/test.html");

    settestPath("");
    invoke("create_test_file", {
      templatePath,
      testPath,
      code: content,
      test: `describe("Sum of two numbers", () => {
        it("Should return the sum of the two numbers", () => {
          expect(sum(5, 7)).to.equal(12);
          expect(sum(2, 9)).to.equal(11);
        });
      });`,
    });

    setTimeout(() => {
      settestPath("something");
    }, 1000);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setcontent(e.currentTarget.value);
  };

  return (
    <div className="flex min-h-screen items-center w-full">
      {iframeTestPath ? (
        <div className="flex-1">
          <iframe
            ref={ref}
            className="w-full h-full"
            src="http://127.0.0.1:8000/static/test.html"
          />
        </div>
      ) : (
        <p>Waiting for test to run</p>
      )}
      <div className="flex-1">
        <textarea onChange={onChange} />
        <button onClick={launchTest}>Test</button>
      </div>
    </div>
  );
};

export default Form;
