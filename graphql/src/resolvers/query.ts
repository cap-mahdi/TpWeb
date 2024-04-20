import { GraphQLError } from "graphql";
import { Context, Cv } from "../types";
import { cvExists } from "../utils";

type GetCvByIdArgs = {
  id: string;
};

export const Query = {
  cvs: (parent: unknown, args: {}, { prisma }: GraphQLContext) => {
    return prisma.cv.findMany();
  },
  cv: async (
    parent: unknown,
    { id }: { id: string },
    { prisma }: GraphQLContext
  ) => {
    const cv = await prisma.cv.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!cv) throw new GraphQLError("cv not found");
    return cv;
  },
  users: async (parent: unknown, args: {}, { prisma }: GraphQLContext) => {
    const users = await prisma.user.findMany();
    return users;
  },
  skills: async (parent: unknown, args: {}, { prisma }: GraphQLContext) => {
    const skills = await prisma.skill.findMany({
      relationLoadStrategy: "join",
      include: {
        cvs: true,
      },
    });
    return skills;
  },
};
