import { createClient } from "redis";
import { REDIS_URL } from "../env";

const redisClient = createClient({
  url: REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 10000,
  },
});

export { redisClient };
