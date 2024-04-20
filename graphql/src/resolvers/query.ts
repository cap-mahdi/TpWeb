import { GraphQLError } from "graphql";
import { Context, Cv } from "../types";
import { cvExists } from "../utils";

type GetCvByIdArgs = {
  id: string;
};

export const Query = {
  getAllCv: (_: unknown, _1: {}, { db }: Context): Cv[] => {
    return db.cvs;
  },
  getCvByID: (_: unknown, { id }: GetCvByIdArgs, { db }: Context): Cv => {
    if (!cvExists(db, id)) {
      throw new GraphQLError(`Cv with id ${id} not found`);
    }
    return db.cvs.find((cv: Cv) => cv.id === id)!;
  },
};
