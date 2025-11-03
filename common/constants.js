const usernameArg = '--username=';

const getUserNameFromArgs = () => {
  const args = process.argv.slice(2);

  const userName = args.find((arg) => arg.startsWith(usernameArg));

  if (userName) {
    return userName.slice(usernameArg.length);
  }
  return 'Anonymous';
};

export const consoleUserName = getUserNameFromArgs();
export const failMessage = 'Operation failed';
export const invalidCommandMessage = 'Invalid input';
