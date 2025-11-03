import { invalidCommandMessage } from "./constants.js";

export class CustomInputError extends Error {
  constructor() {
    super(invalidCommandMessage);
  }
}
