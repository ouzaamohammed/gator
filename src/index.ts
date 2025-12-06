import { registerCommand, runCommand, type CommandsRegistry } from "./commands";
import { handlerLogin } from "./handlers/login";

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
}

main();
