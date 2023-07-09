import { proxy } from "valtio";

import { ChallengeStates } from "./states/challenge";
import { StepperStates } from "./states/stepper";
import { ChallengeActions } from "./actions/challenge";
import { StepperActions } from "./actions/stepper";

export const store = proxy({
  challenge: ChallengeStates,
  stepper: StepperStates,
});

export const actions = {
  challenge: ChallengeActions,
  stepper: StepperActions,
};
