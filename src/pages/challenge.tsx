import CodeDisplay from "../components/code_display";
import SubjectDisplay from "../components/subject_display";

const ChallengePage = () => {
  return (
    <div className="w-full p-8">
      <p>Sum of two numbers</p>
      <div className="flex gap-4 min-h-[80vh] flex-grow-1">
        <div className="flex-1">
          <SubjectDisplay file={``} />
        </div>
        <div className="flex flex-col gap-10 flex-1">
          <div className="flex-1">
            <div className="bg-neutral-700 text-white py-1 px-3 rounded-tl-md rounded-tr-md">
              <p>Code</p>
            </div>
            <CodeDisplay />
          </div>
          <p>Tests will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
