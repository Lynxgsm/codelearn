import { store } from "..";
import { Test, TestWithResult } from "../../types/Test";

type ChallengeActionProps = {
  addTest: (test: Test) => void;
  setTestsWithValue: (value: TestWithResult) => void;
  setFunctionName: (name: string) => void;
  setTestString: (test: string) => void;
};

export const ChallengeActions: ChallengeActionProps = {
  addTest: (test) => store.challenge.states.tests.push(test),
  setFunctionName: (name) => (store.challenge.states.functionName = name),
  setTestsWithValue: (value) => {
    const tests = store.challenge.states.testsWithValue;
    const index = tests.findIndex((test) => test.id === value.id);

    if (index > -1) {
      tests[index] = value;
      console.log(tests[index]);
    } else {
      tests.push(value);
    }
  },
  setTestString: (test) => (store.challenge.states.testString = test),
};
