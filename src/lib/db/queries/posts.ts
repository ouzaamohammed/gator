import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, type NewPost, posts } from "../schema";

export async function createPost(post: NewPost) {
  await db.insert(posts).values(post);
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      description: posts.description,
      url: posts.url,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
    .innerJoin(feeds, eq(feeds.id, posts.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result;
}
