import { getFeedByURL } from "../lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows";
import { printFeedFollow } from "../lib/db/queries/utils";
import type { User } from "../lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feed_url>`);
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

export async function handlerListFeedFollows(_: string, user: User) {
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

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feed_url>`);
  }

  const feedURL = args[0];
  const feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`Failed to find feed: ${feedURL}`);
  }

  await deleteFeedFollow(user.id, feed.id);
  console.log(`${user.name} unfollowed ${feed.name} successfully!`);
}
