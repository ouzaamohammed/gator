import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <name>`);
  }

  const username = args[0];
  setUser(username);
  console.log(`${username} is logged in successfully!`);
}
