import { getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feed-follows";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const url = args[0];
  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Failed to find a feed with url: ${url}`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  if (!feedFollow) {
    throw new Error(`Failed to follow feed: ${feed.id}`);
  }

  console.log(
    `${feedFollow.userName} followed ${feedFollow.feedName} successfully!`
  );
}
