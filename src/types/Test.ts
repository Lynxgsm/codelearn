export type Test = {
  functionName: string;
  params: string[];
};

export type TestWithResult = {
  id: string;
  functionName: string;
  params: { [key: string]: string };
  result: string;
};
