import { proxy } from "valtio";
import { challenge } from "./challenge/challenge";
import { stepper } from "./stepper/stepper";

export const store = proxy({
  challenge,
  stepper,
});
