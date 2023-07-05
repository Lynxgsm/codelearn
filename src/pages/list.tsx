import { unslugify } from "../helpers/strings";
import useChallengeList from "../hooks/useChallengeList";
import { Link } from "react-router-dom";

const ListPage = () => {
  return (
    <section className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl">Challenges</h1>
      <div className="flex items-start gap-8">
        <ListContainer />
        <Link
          to="/create"
          className="grid place-content-center p-8 border-2 border-dashed hover:bg-neutral-400 hover:border-solid"
        >
          Create challenge
        </Link>
      </div>
    </section>
  );
};

const ListContainer = () => {
  const { challenges } = useChallengeList();
  return (
    <ul className="flex flex-col gap-2 flex-1">
      {challenges.map((challenge) => (
        <li className="capitalize rounded-sm bg-neutral-100 p-2 hover:bg-neutral-300">
          <Link to={`/challenge/${challenge}`}>{unslugify(challenge)}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ListPage;
