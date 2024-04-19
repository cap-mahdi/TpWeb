import { GraphQLError } from "graphql"
import { GraphQLContext } from "../context"
import { CreateCvDto, UpdateCvDto } from "../dto"

export const Mutation = {
    createUser: async (
        parent: unknown,
        { email, name }: {
            email: string, name: string
        },
        { prisma }: GraphQLContext
    ) => {
        const newUser = await prisma.user.create({
            data: {
                name,
                email
            }
        })
        return newUser
    },
    createSkill: async (
        parent: unknown,
        { designation }: { designation: string },
        { prisma }: GraphQLContext
    ) => {
        const newSkill = await prisma.skill.create({
            data: {
                designation
            }
        })
        return newSkill
    },
    createCv: async (
        parent: unknown,
        { createCvDto }: { createCvDto: CreateCvDto },
        { prisma }: GraphQLContext
    ) => {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(createCvDto.userId)
            }
        })
        if (!user)
            throw new GraphQLError("user not found")

        createCvDto.skills.forEach(async (skillId) => {
            const skill = await prisma.skill.findUnique({
                where: {
                    id: parseInt(skillId)
                }
            })
            if (!skill)
                throw new GraphQLError("skill not found")
        })

        const cvData = {
            ...createCvDto,
            userId: parseInt(createCvDto.userId),
            skills: {
                connect: createCvDto.skills.map(skill => ({ id: parseInt(skill) })),
            }
        }
        const newCv = await prisma.cv.create({
            data: cvData,
            relationLoadStrategy: 'join',
            include: {
                user: true,
                skills: true
            },
        })

        return newCv
    },
    updateCv: async (
        parent: unknown,
        { id, updateCvDto }: { id: string, updateCvDto: UpdateCvDto },
        { prisma }: GraphQLContext
    ) => {
        const foundCv = await prisma.cv.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!foundCv) {
            throw new GraphQLError('CV not found');
        }

        const updatedCv = await prisma.cv.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...updateCvDto,
                skills: {
                    set: updateCvDto.skills.map(skill => ({ id: parseInt(skill) })),
                }
            }
        })
        return updatedCv
    },
    deleteCv: async (parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const foundCv = await prisma.cv.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!foundCv) {
            throw new GraphQLError('CV not found');
        }

        const cv = await prisma.cv.delete({
            where: {
                id: parseInt(id),
            },
        })
        return cv
    },
}