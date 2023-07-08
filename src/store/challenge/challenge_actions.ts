import { store } from "..";
import { initialTest } from "../../constants/strings";
import { Test, TestWithResult } from "../../types/Test";

type ChallengeActionProps = {
  addTest: (test: Test) => void;
  setTestsWithValue: (value: TestWithResult) => void;
  modifyTestString: (value: string) => void;
  setWrittenCode: (code: string) => void;
  resetChallengeForm: () => void;
};

export const ChallengeActions = (): ChallengeActionProps => {
  const { states } = store.challenge;
  return {
    addTest: (test) => states.tests.push(test),
    setTestsWithValue: (value) => {
      const index = states.testsWithValue.findIndex(
        (test) => test.id === value.id
      );
      index > -1
        ? (states.testsWithValue[index] = value)
        : states.testsWithValue.push(value);
    },
    modifyTestString: (value: string) => {
      states.testString = initialTest;
      states.testString.replaceAll("#TITLE", value);
    },
    setWrittenCode: (code) => (states.writtenCode = code),
    resetChallengeForm: () => {
      states.description = "";
      states.title = "";
    },
  };
};
