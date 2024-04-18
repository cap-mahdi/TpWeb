export const Query = {
  getAllCv: (parent: any, args: any, context: any) => {
    return context.db.cvs;
  },
  getCvByID: (parent: any, args: any, context: any) => {
    return context.db.cvs.find((cv: any) => cv.id === +args.id);
  },
};
