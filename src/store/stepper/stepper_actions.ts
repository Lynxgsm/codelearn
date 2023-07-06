import { store } from "..";

type StepperActionsType = {
  handleNext: () => void;
  handlePrevious: () => void;
};

export const StepperActions: StepperActionsType = {
  handleNext: () => (store.stepper.states.currentIndex += 1),
  handlePrevious: () => (store.stepper.states.currentIndex -= 1),
};
