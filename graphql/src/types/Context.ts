import { PubSub } from "graphql-yoga";
import { Cv, CvSkill, CvSubscriptionReturn, Skill, User } from "./";
import { PubSubChannels } from "../pubsub";
import { PrismaClient } from "@prisma/client";

export type Context = {
  pubSub: PubSub<PubSubChannels>;
  prisma: PrismaClient;
};
