import { handlerAgg } from "./commands/aggregate";
import { handlerBrowse } from "./commands/browse";
import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands/commands";
import {
  handlerFollow,
  handlerListFeedFollows,
  handlerUnfollow,
} from "./commands/feed-follows";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import {
  handlerListUsers,
  handlerLogin,
  handlerRegister,
} from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerListUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerListFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(
    registry,
    "following",
    middlewareLoggedIn(handlerListFeedFollows),
  );
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
