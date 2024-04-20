import { GraphQLError } from "graphql";
import { Context as GraphQLContext } from "../types";

type GetCvByIdArgs = {
  id: string;
};

export const Query = {
  getAllCv: (_: unknown, _1: {}, { prisma }: GraphQLContext) => {
    return prisma.cv.findMany();
  },
  getCvByID: async (
    _: unknown,
    { id }: GetCvByIdArgs,
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
  getAllUser: async (_: unknown, _1: {}, { prisma }: GraphQLContext) => {
    const users = await prisma.user.findMany();
    return users;
  },
  getSkills: async (_: unknown, _1: {}, { prisma }: GraphQLContext) => {
    const skills = await prisma.skill.findMany({
      relationLoadStrategy: "join",
      include: {
        cvs: true,
      },
    });
    return skills;
  },
};
