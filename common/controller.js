import { homedir } from "os";

import {
  consoleUserName,
  failMessage,
  invalidCommandMessage,
} from "./constants.js";
import { exitProgram, getPath } from "./helpers.js";
import {
  list,
  read,
  create,
  rename,
  copy,
  move,
  remove,
  makeDirectory,
} from "./commands.js";
import { myOs } from "./sysInfo.js";
import { calculateHash } from "./hash.js";
import { compress } from "./brotli.js";

export class MyController {
  constructor() {
    this.path = homedir();
    process.chdir(this.path);
    console.log(`Welcome to the File Manager, ${consoleUserName}!`);
    this.where();
  }

  process = async line => {
    try {
      if (typeof line !== "string") {
        throw new Error("fail input");
      }
      const { command, rest } = this.parseCommand(line);

      switch (command) {
        case ".exit":
          await this.exit();
          break;
        case "":
          break;
        case "up":
          this.changePath("..");
          break;
        case "cd":
          this.changePath(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "ls":
        case "dir":
          await list(this.path);
          break;
        case "cat":
          await read(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "add":
          await create(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "mkdir":
          await makeDirectory(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "rn":
          const { path: pathToFileRename, rest: fileNameRename } =
            this.parsePath(rest);
          await rename({
            sourceFilePath: getPath(this.path, pathToFileRename),
            newFileName: fileNameRename,
          });
          break;
        case "cp":
          await copy(this.getPathToFileAndPathToDestinationFolder(rest));
          break;
        case "mv":
          await move(this.getPathToFileAndPathToDestinationFolder(rest));
          break;
        case "rm":
          await remove(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "os":
          await myOs(rest);
          break;
        case "hash":
          await calculateHash(getPath(this.path, this.pathUnshelling(rest)));
          break;
        case "compress":
          await compress({
            ...this.getPathToFileAndPathToDestinationFolder(rest),
            isCompress: true,
          });
          break;
        case "decompress":
          await compress({
            ...this.getPathToFileAndPathToDestinationFolder(rest),
            isCompress: false,
          });
          break;
        default:
          this.fail(invalidCommandMessage);
          break;
      }
    } catch (error) {
      this.fail();
    }
    this.where();
  };

  parseCommand = line => {
    const trimLine = line.trim();
    const commandEndIndex = trimLine.indexOf(" ");
    if (~commandEndIndex) {
      return {
        command: trimLine.slice(0, commandEndIndex),
        rest: trimLine.slice(commandEndIndex).trim(),
      };
    }
    return { command: trimLine, rest: "" };
  };

  parsePath = line => {
    if (line.length > 2 && line[0] == `"`) {
      const endOfPath = line.indexOf(`"`, 1);
      if (~endOfPath) {
        return {
          path: this.pathUnshelling(line.slice(0, endOfPath +1)),
          rest: this.pathUnshelling(line.slice(endOfPath +1).trim()),
        };
      } else {
        throw new Error();
      }
    } else if (line.length > 2) {
      const endOfPath = line.indexOf(" ", 1);
      if (~endOfPath) {
        return {
          path: this.pathUnshelling(line.slice(0, endOfPath)),
          rest: this.pathUnshelling(line.slice(endOfPath).trim()),
        };
      } else {
        return {
          path: line,
          rest: "",
        };
      }
    }
  };

  pathUnshelling = path => {
    if (
      !(path.length > 2 && path[0] == path[path.length - 1] && path[0] == `"`)
    ) {
      return path;
    }
    return this.pathUnshelling(path.slice(1, -1));
  };

  getPathToFileAndPathToDestinationFolder = rest => {
    const { path: pathToFileCopy, rest: pathToDestinationDirectory } =
      this.parsePath(rest);
    return {
      sourceFilePath: getPath(this.path, pathToFileCopy),
      targetDirectoryPath: getPath(this.path, pathToDestinationDirectory),
    };
  };

  changePath = path => {
    process.chdir(path);
    this.path = process.cwd();
  };

  where = () => {
    console.log(`You are currently in ${this.path}`);
  };

  fail = (msg = failMessage) => {
    console.log(msg);
  };

  exit = async () => {
    await exitProgram();
  };
}
