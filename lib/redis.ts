// lib/redis.ts or utils/redis.ts
import { createClient } from "redis";

export const redis = createClient({
  socket: {
    host: "192.168.254.59",
    port: 6379,
  },
});

redis.on("error", (err) => console.error("Redis Client Error", err));

process.on("SIGINT", async () => {
  await redis.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await redis.quit();
  process.exit(0);
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};

export const setUserOnline = async (userId?: string) => {
  if (!userId) {
    throw new Error("User ID is required to set user online.");
  }

  await connectRedis();
  await redis.set(`user:${userId}:online`, "1", { EX: 60 });
};

export const setUserOffline = async (userId?: string) => {
  if (!userId) {
    throw new Error("User ID is required to set user offline.");
  }

  await connectRedis();
  await redis.del(`user:${userId}:online`);
};

export const isUserOnline = async (userId: string): Promise<boolean> => {
  await connectRedis();
  return (await redis.exists(`user:${userId}:online`)) === 1;
};
