import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const SubjectCreation = () => {
  const [content, setcontent] = useState<string | undefined>("");

  const handleContent = (value?: string | undefined) => {
    setcontent(value);
  };

  return (
    <MDEditor
      onChange={handleContent}
      value={content}
      aria-required={true}
      className="mt-2"
    />
  );
};

export default SubjectCreation;
