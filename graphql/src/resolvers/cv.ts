import { Cv as CvModel } from "@prisma/client";
import { Context as GraphQLContext } from "../types";
export const Cv = {
  owner: async (cv: CvModel, _: unknown, { prisma }: GraphQLContext) => {
    const user = await prisma.user.findUnique({
      where: {
        id: cv.userId,
      },
    });
    return user;
  },
  skills: async (parent: CvModel, _: unknown, { prisma }: GraphQLContext) => {
    const cv = await prisma.cv.findFirst({
      where: {
        id: parent.id,
      },
      relationLoadStrategy: "join",
      include: {
        skills: true,
      },
    });
    return cv?.skills;
  },
};
