import { User as UserModel } from "@prisma/client";
import { GraphQLContext } from "../context";

export const User = {
    cvs: async (
        parent: UserModel,
        _: unknown,
        { prisma }: GraphQLContext
    ) => {
        const cvs = await prisma.cv.findMany({
            where: {
                userId: parent.id
            }
        })
        return cvs
    }
}