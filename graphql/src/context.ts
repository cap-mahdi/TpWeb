import { PrismaClient } from "@prisma/client";
import { pubSub } from "./pubsub";
import { Context } from "./types";

const prisma = new PrismaClient();

export const context: Context = {
  prisma,
  pubSub,
};
