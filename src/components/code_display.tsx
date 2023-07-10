import { javascript } from "@codemirror/lang-javascript";
import CodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { FC } from "react";

type Props = ReactCodeMirrorProps &
  ReactCodeMirrorRef & {
    customclass?: string;
  };

const CodeDisplay: FC<Props> = (props) => {
  return (
    <CodeMirror
      theme={"dark"}
      {...props}
      className={`w-full h-full text-lg ${props.customclass}`}
      height="200px"
      extensions={[javascript({ jsx: true })]}
    />
  );
};

export default CodeDisplay;
