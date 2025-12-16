export function firstOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }
  return items[0];
}

export function printFeedFollow(userName: string, feedName: string) {
  console.log(`${userName} followed ${feedName} successfully!`);
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      `Invalid duration: ${durationStr} - use format 1h, 30m, 10s, or 1500ms`,
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1_000;
    case "m":
      return value * 60_000;
    case "h":
      return value * 3_600_000;
    default:
      throw new Error(
        `Invalid duration: ${durationStr} - use format 1h, 30m, 10s, or 1500ms`,
      );
  }
}
