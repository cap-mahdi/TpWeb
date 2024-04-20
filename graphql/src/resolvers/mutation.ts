import { GraphQLError } from "graphql";
import {
  CreateCvDto,
  CreateSkillDto,
  CreateUserDto,
  UpdateCvDto,
} from "../dto";
import {
  Cv,
  CvWithSkills,
  Context as GraphQLContext,
  MutationType,
} from "../types";
import { PubSubEvents } from "../pubsub";

export const Mutation = {
  createUser: async (
    _: unknown,
    { email, name }: CreateUserDto,
    { prisma }: GraphQLContext
  ) => {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return newUser;
  },
  createSkill: async (
    _: unknown,
    { designation }: CreateSkillDto,
    { prisma }: GraphQLContext
  ) => {
    const newSkill = await prisma.skill.create({
      data: {
        designation,
      },
    });
    return newSkill;
  },
  addCv: async (
    _: unknown,
    { addCvInput }: { addCvInput: CreateCvDto },
    { prisma, pubSub }: GraphQLContext
  ): Promise<CvWithSkills> => {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(addCvInput.userId),
      },
    });
    if (!user) throw new GraphQLError("user not found");

    for (const skillId of addCvInput.skills) {
      const skill = await prisma.skill.findUnique({
        where: {
          id: parseInt(skillId),
        },
      });
      if (!skill) {
        throw new GraphQLError("skill not found");
      }
    }
    const cvData = {
      ...addCvInput,
      userId: parseInt(addCvInput.userId),
      skills: {
        connect: addCvInput.skills.map((skill) => ({ id: parseInt(skill) })),
      },
    };
    const newCv = await prisma.cv.create({
      data: cvData,
      relationLoadStrategy: "join",
      include: {
        user: true,
        skills: true,
      },
    });
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        cv: { ...newCv, user: newCv.user.id },
        mutation: MutationType.ADD,
      },
    });
    return {
      ...newCv,
      skills: newCv.skills.map((skill) => skill.id),
      user: newCv.user.id,
    };
  },
  updateCv: async (
    _: unknown,
    { id, updateCvInput }: { id: string; updateCvInput: UpdateCvDto },
    { prisma, pubSub }: GraphQLContext
  ): Promise<CvWithSkills> => {
    console.log(updateCvInput);
    const foundCv = await prisma.cv.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!foundCv) {
      throw new GraphQLError("CV not found");
    }

    for (const skillId of updateCvInput.skills || []) {
      const skill = await prisma.skill.findUnique({
        where: {
          id: parseInt(skillId),
        },
      });
      if (!skill) {
        throw new GraphQLError("skill not found");
      }
    }

    const updatedCv = await prisma.cv.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...updateCvInput,
        skills: {
          set: updateCvInput.skills?.map((skill) => ({ id: parseInt(skill) })),
        },
        userId: updateCvInput.userId || foundCv.userId,
      },
      relationLoadStrategy: "join",
      include: {
        user: true,
        skills: true,
      },
    });
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        cv: { ...updatedCv, user: updatedCv.user.id },
        mutation: MutationType.UPDATE,
      },
    });
    return {
      ...updatedCv,
      skills: updatedCv.skills.map((skill) => skill.id),
      user: updatedCv.user.id,
    };
  },
  deleteCv: async (
    _: unknown,
    { id }: { id: string },
    { prisma, pubSub }: GraphQLContext
  ) => {
    const foundCv = await prisma.cv.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!foundCv) {
      throw new GraphQLError("CV not found");
    }

    const cv = await prisma.cv.delete({
      where: {
        id: parseInt(id),
      },
      relationLoadStrategy: "join",
      include: {
        user: true,
        skills: true,
      },
    });
    console.log("cvHSOSOSOSOSO", cv);
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        cv: { ...cv, user: cv.user.id },
        mutation: MutationType.DELETE,
      },
    });
    return {
      ...cv,
      skills: cv.skills.map((skill) => skill.id),
      user: cv.user.id,
    };
  },
};
