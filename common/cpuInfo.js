import { cpus } from 'os';
export const getCPUInfo = () => {
  const myCpus = cpus();
  console.log('\namount CPUs: ', myCpus.length, '\n');
  console.table(myCpus.map(({ model, speed }) => ({ model, speed: `${speed / 1000}GHz` })));

  return;
};
