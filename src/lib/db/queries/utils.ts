export function firstOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }
  return items[0];
}

export function printFeedFollow(userName: string, feedName: string) {
  console.log(`${userName} followed ${feedName} successfully!`);
}
