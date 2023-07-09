import { FormEvent } from "react";
import Input from "../../components/common/input";
import MDEditor from "@uiw/react-md-editor";
import { actions, store } from "../../store";
import { useSnapshot } from "valtio";
import Button from "../../components/common/button";
import { toast } from "react-hot-toast";

const CreateInformation = () => {
  const { modifyTestString } = actions.challenge;
  const { handleNext } = actions.stepper;
  const { testString, title, description } = useSnapshot(store.challenge);

  const handleContent = (value?: string | undefined) => {
    if (value) {
      store.challenge.description = value;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    title.includes("#TITLE")
      ? (store.challenge.testString = testString.replaceAll("#TITLE", title))
      : modifyTestString(title);

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
        onChange={(e) => (store.challenge.title = e.currentTarget.value)}
        label="Titre"
        required
        value={title}
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
