import { store } from "..";

type StepperActionsType = {
  handleNext: () => void;
  handlePrevious: () => void;
  resetIndex: () => void;
};

export const StepperActions: StepperActionsType = {
  handleNext: () => (store.stepper.currentIndex += 1),
  handlePrevious: () => (store.stepper.currentIndex -= 1),
  resetIndex: () => (store.stepper.currentIndex = 0),
};
