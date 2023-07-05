import CreateChallengeForm from "../components/forms/create_challenge_form";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateChallengePage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <button onClick={() => navigate(-1)}>
        <FaChevronLeft />
      </button>
      <CreateChallengeForm />
    </div>
  );
};

export default CreateChallengePage;
