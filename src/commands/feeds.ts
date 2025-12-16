import { getUserById } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import type { Feed, User } from "../lib/db/schema";
import { createFeedFollow } from "../lib/db/queries/feed-follows";
import { printFeedFollow } from "../lib/db/queries/utils";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`Usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error("Failed to create feed");
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  if (!feedFollow) {
    throw new Error(`Failed to follow feed: ${feed.id}`);
  }
  printFeedFollow(feedFollow.userName, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, user);
}

export async function handlerListFeeds(_: string) {
  const feeds = await getFeeds();
  if (feeds.length === 0) {
    console.log("No feeds was found");
    return;
  }

  console.log("Found %d Feeds:\n", feeds.length);
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed: ${feed.id}`);
    }

    printFeed(feed, user);
    console.log("--------------");
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID: ${feed.id}`);
  console.log(`* Created: ${feed.createdAt}`);
  console.log(`* Updated: ${feed.updatedAt}`);
  console.log(`* name: ${feed.name}`);
  console.log(`* URL: ${feed.url}`);
  console.log(`* User: ${user.name}`);
}
