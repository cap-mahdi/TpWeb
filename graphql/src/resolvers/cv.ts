import { Cv as CvModel } from "@prisma/client";
import { CvWithSkills, Context as GraphQLContext } from "../types";
export const Cv = {
  owner: async (cv: CvModel, _: unknown, { prisma }: GraphQLContext) => {
    const user = await prisma.user.findUnique({
      where: {
        id: cv.userId,
      },
    });
    return user;
  },
  skills: async (cv: CvWithSkills, _: unknown, { prisma }: GraphQLContext) => {
    return await prisma.skill.findMany({
      where: {
        id: {
          in: cv.skills,
        },
      },
    });
  },
};
