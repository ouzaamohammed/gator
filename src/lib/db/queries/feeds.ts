import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { type Feed, feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, userId: string) {
  const result = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return firstOrUndefined(result);
}

export async function getFeeds() {
  return await db.select().from(feeds);
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
  await db
    .update(feeds)
    .set({ lastFetchedAt: sql`NOW()`, updatedAt: sql`NOW()` })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} nulls first`)
    .limit(1);

  return firstOrUndefined(result);
}
