import { Test, TestWithResult } from "../../types/Test";

type ChallengeStatesProps = {
  tests: Test[];
  testsWithValue: TestWithResult[];
  testString: string;
  functionName: string;
};

export const ChallengeStates: ChallengeStatesProps = {
  tests: [],
  functionName: "",
  testsWithValue: [],
  testString: `
describe("#TITLE", () => {
  it("#TITLE", () => {
    #TESTS
  });
});
`,
};
