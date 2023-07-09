import { useEffect } from "react";
import Stepper from "../../components/stepper";
import CreateInformation from "./information";
import CreatePreview from "./preview";
import CreateTest from "./test";
import { actions } from "../../store";

const CreateChallengePage = () => {
  const { resetIndex } = actions.stepper;
  useEffect(() => {
    return () => {
      resetIndex();
    };
  }, []);
  return (
    <Stepper
      steps={[<CreateInformation />, <CreateTest />, <CreatePreview />]}
    />
  );
};

export default CreateChallengePage;
