import { log } from "console";

export const Query = {
  getAllCv: (parent: any, args: any, context: any) => {
    return context.db.cvs;
  },
  getCvByID: (parent: any, args: any, context: any) => {
    console.log(args);
    return context.db.cvs.find((cv: any) => cv.id === +args.id);
  },
};
