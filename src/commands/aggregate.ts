import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss";
import { parseDuration } from "../lib/db/queries/utils";
import { createPost } from "../lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
  }

  const timeStr = args[0];
  console.log(`Collecting feeds every ${timeStr}`);
  const timeBetweenReqs = parseDuration(timeStr);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenReqs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }

  console.log("Found a feed to fetch");
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);
  for (const item of feedData.channel.item) {
    console.log(`Found post: ${item.title}`);
    await createPost({
      title: item.title,
      description: item.description,
      url: item.link,
      publishedAt: new Date(item.pubDate),
      feedId: feed.id,
    });
  }
  console.log(
    `feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function handleError(err: unknown) {
  console.log(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}
