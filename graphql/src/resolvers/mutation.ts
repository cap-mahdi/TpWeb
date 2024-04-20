import { GraphQLError } from "graphql";
import { Context, Cv, CvWithSkills, MutationType } from "../types";
import { cvExists, skillExists, userExists } from "../utils";
import { PubSubEvents } from "../pubsub";

type AddCvArgs = {
  addCvInput: Omit<Cv, "id"> & {
    skills: string[];
  };
};

type UpdateCvArgs = {
  id: string;
  updateCvInput: Partial<Omit<Cv, "id">> & {
    skills?: string[];
  };
};

type DeleteCvArgs = {
  id: string;
};

export const Mutation = {
  addCv: (_: unknown, { addCvInput }: AddCvArgs, { db, pubSub }: Context) => {
    if (!userExists(db, addCvInput.owner)) {
      throw new GraphQLError(`There is no user with id ${addCvInput.owner}`);
    }

    for (const skillId of addCvInput.skills) {
      if (!skillExists(db, skillId)) {
        throw new GraphQLError(`There is no skill with id ${skillId}`);
      }
    }

    const newCv = {
      id: (+db.cvs[db.cvs.length - 1].id + 1).toString(),
      ...addCvInput,
    };
    db.cvs.push(newCv);
    db.cvSkills.push(
      ...addCvInput.skills.map((skillId: string) => ({
        cvId: newCv.id,
        skillId,
      }))
    );
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: { mutation: MutationType.ADD, cv: newCv },
    });

    return newCv;
  },

  updateCv: (
    _: unknown,
    { updateCvInput, id }: UpdateCvArgs,
    { db, pubSub }: Context
  ) => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }

    if (updateCvInput.owner && !userExists(db, updateCvInput.owner)) {
      throw new GraphQLError(`There is no user with id ${updateCvInput.owner}`);
    }

    for (const skillId of updateCvInput.skills || []) {
      if (!skillExists(db, skillId)) {
        throw new GraphQLError(`There is no skill with id ${skillId}`);
      }
    }

    let cvIndex = db.cvs.findIndex((cv: Cv) => cv.id === id);

    db.cvs[cvIndex] = {
      ...db.cvs[cvIndex],
      ...updateCvInput,
    };

    if (updateCvInput.skills) {
      db.cvSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId !== id);
      db.cvSkills.push(
        ...updateCvInput.skills.map((skillId: string) => ({
          cvId: id,
          skillId,
        }))
      );
    }
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.UPDATE,
        cv: db.cvs[cvIndex],
      },
    });

    return db.cvs[cvIndex];
  },

  deleteCv: (
    _: unknown,
    { id }: DeleteCvArgs,
    { db, pubSub }: Context
  ): CvWithSkills => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`There is no cv with id ${id}`);
    }
    const relatedSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId === id);
    db.cvSkills = db.cvSkills.filter((cvSkill) => cvSkill.cvId !== id);
    const deletedCvIndex = db.cvs.findIndex((cv: Cv) => cv.id === id);
    pubSub.publish(PubSubEvents.NOTIFY, {
      notifyCv: {
        mutation: MutationType.DELETE,
        cv: db.cvs[deletedCvIndex],
      },
    });
    const deletedCv = db.cvs.splice(deletedCvIndex, 1)[0];
    return {
      ...deletedCv,
      skills: relatedSkills.map((cvSkill) => cvSkill.skillId),
    };
  },
};
