import {
  readdir,
  readFile,
  stat,
  writeFile,
  rename as renameFS,
  unlink,
  mkdir,
} from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { failMessage } from "./constants.js";
import { pipeline } from "node:stream";
import { isFile, isFree, getNewFilePath, getNewFilePath2 } from "./helpers.js";

const sortDirents = (dirents = [], type) =>
  dirents
    .map(x => ({ name: x.name, type, sortField: x.name.toLowerCase() }))
    .sort((a, b) => {
      if (a.sortField > b.sortField) {
        return 1;
      } else if (a.sortField < b.sortField) {
        return -1;
      }
      return 0;
    });

export const list = async path => {
  const dirents = await readdir(path, { withFileTypes: true });
  const fileNames = sortDirents(
    dirents.filter(x => x.isFile()),
    "file"
  );
  const folderNames = sortDirents(
    dirents.filter(x => x.isDirectory()),
    "directory"
  );
  // const linksNames = sortDirents(dirents.filter(x => x.isSymbolicLink()), 'SymbolicLink');

  console.table(
    [...folderNames, ...fileNames /*...linksNames*/],
    ["name", "type"]
  );
};

export const read = async sourceFilePath => {
  const isInputFile = await isFile(sourceFilePath);

  if (!isInputFile) {
    throw new Error(failMessage);
  }

  await new Promise((res, rej) => {
    const readable = createReadStream(sourceFilePath, { encoding: "utf8" });

    console.log("\x1b[36m%s\x1b[0m", "File content:\n");

    readable.on("data", chunk => {
      console.log(chunk);
    });
    readable.on("end", () => {
      process.stdout.setEncoding("utf8");
      res();
    });
    readable.on("error", e => {
      rej(e);
    });
  });
};

export const create = async sourceFilePath => {
  await writeFile(sourceFilePath, "", { flag: "wx" });
};

export const makeDirectory = async sourceDirectoryPathPath => {
  await mkdir(sourceDirectoryPathPath, { recursive: true });
};

export const rename = async ({
  sourceFilePath,
  newFileName,
  targetDirectoryName,
}) => {
  const isInputFile = await isFile(sourceFilePath);

  if (!isInputFile) {
    throw new Error(failMessage);
  }
  let newFilePath;
  if (newFileName) {
    newFilePath = getNewFilePath(sourceFilePath, newFileName);
  } else if (targetDirectoryName) {
    newFilePath = getNewFilePath2(sourceFilePath, targetDirectoryName);
  }
  await renameFS(sourceFilePath, newFilePath);
};

export const copy = async ({ sourceFilePath, targetDirectoryPath }) => {
  const isInputFile = await isFile(sourceFilePath);
  if (!isInputFile) {
    throw new Error(failMessage);
  }

  const newFilePath = getNewFilePath2(sourceFilePath, targetDirectoryPath);
  const writable = createWriteStream(newFilePath, { flags: "wx" });
  const readable = createReadStream(sourceFilePath);

  await new Promise((res, rej) => {
    pipeline(readable, writable, err => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};

export const move = async ({ sourceFilePath, targetDirectoryPath }) => {
  await copy({ sourceFilePath, targetDirectoryPath });
  await remove(sourceFilePath);
};

export const remove = async sourceFilePath => {
  const isInputFile = await isFile(sourceFilePath);

  if (!isInputFile) {
    throw new Error(failMessage);
  }
  await unlink(sourceFilePath);
};
