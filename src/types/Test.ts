export type Test = {
  functionName: string;
  params: string[];
};

export type TestWithResult = {
  id: string;
  functionName: string;
  description: string;
  params: { [key: string]: string };
  result: string;
};
