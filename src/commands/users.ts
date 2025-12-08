import { readConfig, setUser } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const existingUser = await getUser(username);
  if (!existingUser) {
    throw new Error(`User ${username} not found`);
  }

  setUser(username);
  console.log(`${username} is logged in successfully!`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <name>`);
  }

  const username = args[0];
  const user = await createUser(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  setUser(user.name);
  console.log("User created seccussfully!");
}

export async function handlerListUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();

  for (let user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
