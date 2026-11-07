import { createServer } from "node:http";

import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const server = createServer(app);

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("NeonDB connected successfully");

    server.listen(env.PORT, () => {
      console.log(
        `GarmentFlow ERP server running on port ${env.PORT}`
      );
      console.log(
        `Environment: ${env.NODE_ENV}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    await prisma.$disconnect();
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected");
      console.log("Server shutdown complete");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();