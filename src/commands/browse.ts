import type { User } from "../lib/db/schema";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = 2;
  if (args.length === 1) {
    const specifiedLimit = parseInt(args[0]);
    if (!specifiedLimit) {
      throw new Error(`Usage: ${cmdName} [limit]`);
    }
    limit = specifiedLimit;
  }

  const posts = await getPostsForUser(user.id, limit);
  if (posts.length === 0) {
    console.log(`No posts were found for ${user.name}`);
    return;
  }

  console.log(`Found ${posts.length} posts for user ${user.name}`);
  for (const post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log("=====================================");
  }
}
