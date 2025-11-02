import * as readline from "node:readline/promises";
import { MyController } from "./common/controller.js";

const controller = new MyController();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", controller.exit);
rl.on("close", controller.exit);
rl.on("line", controller.process);
