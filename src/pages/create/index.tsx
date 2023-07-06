import Stepper from "../../components/stepper";
import CreateInformation from "./information";
import CreatePreview from "./preview";
import CreateTest from "./test";

const CreateChallengePage = () => {
  return (
    <Stepper
      steps={[<CreateInformation />, <CreateTest />, <CreatePreview />]}
    />
  );
};

export default CreateChallengePage;
