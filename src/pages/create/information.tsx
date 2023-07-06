import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../../components/common/input";
import MDEditor from "@uiw/react-md-editor";
import { store } from "../../store";
import { useSnapshot } from "valtio";
import Button from "../../components/common/button";
import { toast } from "react-hot-toast";

const CreateInformation = () => {
  const [starter, setstarter] = useState("");
  const [errorInScript, seterrorInScript] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState<string | undefined>("");
  const [params, setparams] = useState<string[]>([]);
  const [functionName, setfunctionName] = useState("");

  const { setTestString } = store.challenge.actions;
  const { handleNext } = store.stepper.actions;
  const { testString } = useSnapshot(store.challenge.states);

  const handleContent = (value?: string | undefined) => {
    setdescription(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTestString(testString.replaceAll("#TITLE", title));

    if (description) {
      handleNext();
      return;
    }

    toast.error("Description must not be null");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="title"
        type="text"
        onChange={(e) => settitle(e.currentTarget.value)}
        label="Titre"
        required
      />
      <div>
        <label htmlFor="description">Description</label>
        <MDEditor
          onChange={handleContent}
          value={description}
          aria-required={true}
          className="mt-2"
          id="description"
        />
      </div>
      <Button>Next</Button>
    </form>
  );
};

export default CreateInformation;
