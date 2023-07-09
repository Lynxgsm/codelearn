import { useEffect } from "react";
import Stepper from "../../components/stepper";
import CreateInformation from "./information";
import CreatePreview from "./preview";
import CreateTest from "./test";
import { actions } from "../../store";

const CreateChallengePage = () => {
  const { resetIndex } = actions.stepper;
  const { resetChallengeForm } = actions.challenge;
  useEffect(() => {
    return () => {
      resetIndex();
      resetChallengeForm();
    };
  }, []);

  return (
    <Stepper
      steps={[
        {
          title: "Information",
          child: <CreateInformation />,
        },
        { title: "Test", child: <CreateTest /> },
        { title: "Preview", child: <CreatePreview /> },
      ]}
    />
  );
};

export default CreateChallengePage;
