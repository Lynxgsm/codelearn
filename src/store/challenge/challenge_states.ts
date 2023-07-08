import { initialTest } from "../../constants/strings";
import { Test, TestWithResult } from "../../types/Test";

type ChallengeStatesProps = {
  tests: Test[];
  testsWithValue: TestWithResult[];
  testString: string;
  functionName: string;
  writtenCode: string;
  title: string;
  description: string;
};

export const ChallengeStates: ChallengeStatesProps = {
  tests: [],
  functionName: "",
  testsWithValue: [],
  testString: initialTest,
  writtenCode: "",
  title: "",
  description: "",
};
