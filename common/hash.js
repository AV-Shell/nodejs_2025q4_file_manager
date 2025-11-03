import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { isFile } from './helpers.js';

export const calculateHash = async (sourceFilePath) => {
  const isInputFile = await isFile(sourceFilePath);

  if (!isInputFile) {
    throw new Error(failMessage);
  }

  const hash = createHash('sha256');
  await new Promise((res, rej) => {
    createReadStream(sourceFilePath)
      .pipe(hash)
      .on('finish', () => {
        console.log(`Hash of file  \x1b[36m ${sourceFilePath} \x1b[0m  is \n \x1b[33m${hash.digest('hex')}\x1b[0m`);
        res();
      })
      .on('error', () => {
        rej();
      });
  });
};
