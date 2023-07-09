import { store } from "..";

type StepperActionsType = {
  handleNext: () => void;
  handlePrevious: () => void;
};

export const StepperActions: StepperActionsType = {
  handleNext: () => (store.stepper.currentIndex += 1),
  handlePrevious: () => (store.stepper.currentIndex -= 1),
};
