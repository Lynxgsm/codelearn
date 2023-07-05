import { proxy } from "valtio";
import { challenge } from "./challenge/challenge";

export const store = proxy({
  challenge,
});
