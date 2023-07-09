import { store } from "..";
import { initialTest } from "../../constants/strings";
import { TestWithResult } from "../../types/Test";

type ChallengeActionProps = {
  addTest: (test: TestWithResult) => void;
  setTestsWithValue: (value: TestWithResult) => void;
  modifyTestString: () => void;
  resetChallengeForm: () => void;
  generateTestString: () => void;
};

export const ChallengeActions: ChallengeActionProps = {
  addTest: (test) => store.challenge.testsWithValue.push(test),
  setTestsWithValue: (value) => {
    const index = store.challenge.testsWithValue.findIndex(
      (test) => test.id === value.id
    );
    index > -1
      ? (store.challenge.testsWithValue[index] = value)
      : store.challenge.testsWithValue.push(value);
  },
  modifyTestString: () => {
    store.challenge.testString = initialTest;
    store.challenge.testString = store.challenge.testString.replaceAll(
      "#TITLE",
      store.challenge.title
    );
  },
  generateTestString: () => {
    const generatedString: string[] = [];
    store.challenge.testsWithValue.forEach((test) => {
      const values = Object.values(test.params).map((v) => v);
      values.pop();
      generatedString.push(
        `it("` +
          test.description +
          `", ()=>{
          expect(${test.functionName}(${values.join(",")})).to.equal(${
            test.result
          });
        })`
      );
    });

    store.challenge.testString = store.challenge.testString.replace(
      "# TESTS",
      generatedString.join("\n")
    );

    console.log(generatedString);
  },
  resetChallengeForm: () => {
    store.challenge.description = "";
    store.challenge.title = "";
    store.challenge.tests = [];
    store.challenge.functionName = "";
    store.challenge.starterFunction = "";
  },
};
