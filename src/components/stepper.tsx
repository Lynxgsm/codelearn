import { ReactNode } from "react";
import { store } from "../store";
import { useSnapshot } from "valtio";

const Stepper = ({
  steps,
}: {
  steps: { title: string; child: ReactNode }[];
}) => {
  const { currentIndex } = useSnapshot(store.stepper);
  return (
    <section className="flex flex-col items-start">
      {steps.map(
        ({ title, child }, index) =>
          currentIndex === index && (
            <section
              className="w-full flex flex-col gap-4"
              key={`step_${index}`}
            >
              <h1 className="font-bold text-xl">{title}</h1>
              {child}
            </section>
          )
      )}
    </section>
  );
};

export default Stepper;
