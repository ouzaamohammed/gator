import { getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { getFeedByURL } from "../lib/db/queries/feeds";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows";
import { printFeedFollow } from "../lib/db/queries/utils";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feed_url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feedURL = args[0];
  const feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`Failed to find feed: ${feedURL}`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  if (!feedFollow) {
    throw new Error(`Failed to follow feed: ${feed.id}`);
  }

  printFeedFollow(feedFollow.userName, feedFollow.feedName);
}

export async function handlerListFeedFollows(_: string) {
  const config = readConfig();
  const user = await getUser(config.currentUserName);
  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feedFollows = await getFeedFollowsForUser(user.id);
  if (feedFollows.length === 0) {
    console.log(`No feed follows found for user: ${user.name}`);
    return;
  }

  console.log(`${user.name} is following ${feedFollows.length} feeds`);
  for (const feedFollow of feedFollows) {
    console.log(`* ${feedFollow.feedName}`);
  }
}
