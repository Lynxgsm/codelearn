import CodeView from "./code";
import Instruction from "./instruction";

export default function Home() {
  return (
    <section className="p-8 flex items-center">
      <div className="flex-1">
        <Instruction />
      </div>
      <div className="flex-1">
        <CodeView />
      </div>
    </section>
  );
}
