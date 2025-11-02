import { EOL, homedir, userInfo } from 'os';
import { getCPUInfo } from './cpuInfo.js';

export const myOs = (command) => {
  switch (command) {
    case '--EOL':
      console.log('default system End-Of-Line: ', JSON.stringify(EOL));
      break;
    case '--cpus':
      getCPUInfo()
      break;
    case '--homedir':
      console.log('default system homedir ', homedir());
      break;
    case '--username':
      console.log('current system user name', userInfo().username);
      break;
    case '--architecture':
      console.log('CPU architecture ', process.arch);
      break;

    default:
      throw new Error();
      break;
  }
};

export const getEOL = () => {
  return console.log(JSON.stringify(os.EOL));
};
