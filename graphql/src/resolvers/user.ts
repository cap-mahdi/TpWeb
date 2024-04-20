import { User as UserModel } from "@prisma/client";
import { Context as GraphQLContext } from "../types";

export const User = {
  cvs: async (parent: UserModel, _: unknown, { prisma }: GraphQLContext) => {
    const cvs = await prisma.cv.findMany({
      where: {
        userId: parent.id,
      },
    });
    return cvs;
  },
};
