import { GraphQLError } from "graphql";
import { Context, CvSkill, Cv as CvType, Skill, User } from "../types";

export const Cv = {
  owner: ({ owner }: CvType, _: {}, { db }: Context): User => {
    const foundOwner = db.users.find((user: User) => user.id === owner);
    if (!foundOwner) {
      throw new GraphQLError(`User with id ${owner} not found`);
    }
    return foundOwner;
  },

  skills: ({ id }: CvType, _: {}, { db }: Context): Skill[] => {
    const relatedCvSkills = db.cvSkills.filter(
      (cvSkill: CvSkill) => cvSkill.cvId === id
    );

    return relatedCvSkills.map((cvSkill: CvSkill) => {
      const foundSkill = db.skills.find(
        (skill: Skill) => skill.id === cvSkill.skillId
      );
      if (!foundSkill) {
        throw new GraphQLError(`Skill with id ${cvSkill.skillId} not found`);
      }
      return foundSkill;
    });
  },
};
