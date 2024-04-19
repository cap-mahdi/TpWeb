import { Cv } from "@prisma/client";
import { GraphQLContext } from "../context";

export const CV = {
    user: async (
        cv: Cv,
        _: unknown,
        { prisma }: GraphQLContext
    ) => {
        const user = await prisma.user.findUnique({
            where: {
                id: cv.userId
            }
        })
        return user
    },
    skills: async (
        parent: Cv,
        _: unknown,
        { prisma }: GraphQLContext
    ) => {
        const cv = await prisma.cv.findFirst({
            where: {
                id: parent.id
            },
            relationLoadStrategy: 'join',
            include: {
                skills: true
            },
        })
        return cv?.skills
    },
}