import { ReactNode } from "react";
import { store } from "../store";
import { useSnapshot } from "valtio";

const Stepper = ({ steps }: { steps: ReactNode[] }) => {
  const { currentIndex } = useSnapshot(store.stepper);
  return (
    <section className="flex flex-col items-start">
      {steps.map((step, index) => (
        <section className="w-full" key={`step_${index}`}>
          {currentIndex === index && step}
        </section>
      ))}
    </section>
  );
};

export default Stepper;
