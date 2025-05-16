import { Mutex } from "async-mutex";

const gameLocks = new Map<string, Mutex>();

export function getGameLock(gameId: string): Mutex {
  if (!gameLocks.has(gameId)) {
    gameLocks.set(gameId, new Mutex());
  }
  return gameLocks.get(gameId)!;
}
