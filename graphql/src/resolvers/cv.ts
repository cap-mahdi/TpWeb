export const CV = {
  owner: ({ owner }: any, args: any, context: any) => {
    // console.log("i enter");
    return context.db.users.find((user: any) => user.id === owner);
  },
  skills: ({ skills }: any, args: any, context: any) => {
    // console.log("i enter");
    return context.db.skills.filter((skill: any) => skills.includes(skill.id));
  },
};
