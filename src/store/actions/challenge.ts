import { store } from "..";
import { initialTest } from "../../constants/strings";
import { Test, TestWithResult } from "../../types/Test";

type ChallengeActionProps = {
  addTest: (test: Test) => void;
  setTestsWithValue: (value: TestWithResult) => void;
  modifyTestString: (value: string) => void;
  resetChallengeForm: () => void;
};

export const ChallengeActions: ChallengeActionProps = {
  addTest: (test) => store.challenge.tests.push(test),
  setTestsWithValue: (value) => {
    const index = store.challenge.testsWithValue.findIndex(
      (test) => test.id === value.id
    );
    index > -1
      ? (store.challenge.testsWithValue[index] = value)
      : store.challenge.testsWithValue.push(value);
  },
  modifyTestString: (value: string) => {
    store.challenge.testString = initialTest;
    store.challenge.testString = store.challenge.testString.replaceAll(
      "#TITLE",
      value
    );
  },
  resetChallengeForm: () => {
    store.challenge.description = "";
    store.challenge.title = "";
  },
};
