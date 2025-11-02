import { consoleUserName } from './constants.js';
import path from 'path';
import { stat } from 'node:fs/promises';

export const getPath = (currentPath, relativePath) => {
  return path.resolve(currentPath, relativePath);
};

export const getNewFilePath = (filePath, newFileName) => {
  return path.join(path.dirname(filePath), newFileName);
};

export const getNewFilePath2 = (oldFilePath, targetDirectoryPath, extension = false, isExtAdd) => {
  let { base, name, ext } = path.parse(oldFilePath);
  if (extension) {
    if (isExtAdd) {
      base = base + extension;
    } else {
      if (extension !== ext) {
        throw new Error();
      }
      base = name;
    }
  }
  return path.join(targetDirectoryPath, base);
};

export const isFile = async (sourceFilePath) => {
  try {
    const result = await stat(sourceFilePath).then((x) => x.isFile());
    return result;
  } catch (error) {
    return false;
  }
};

export const isFree = async (sourceFilePath) => {
  try {
    const result = await stat(sourceFilePath);
    return result;
  } catch (error) {
    return false;
  }
};

export const exitProgram = async () => {
  console.log(`Thank you for using File Manager, ${consoleUserName}, goodbye!`);
  await new Promise((res, rej) => {
    setTimeout(() => {
      process.exit(0);
    }, 0);
  });
};
