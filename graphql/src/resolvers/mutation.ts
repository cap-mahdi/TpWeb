interface CvAddInput {
  name: string;
  age: number;
  job: string;
  owner: number;
  skills: number[];
}

interface CvUpdateInput {
  id: number;
  name: string | null;
  age: number | null;
  job: string | null;
  owner: number | null;
  skills: (number | null)[];
}

export const Mutation = {
  addCv: (
    parent: any,
    { addCvInput }: { addCvInput: CvAddInput },
    { db }: any,
    info: any
  ) => {
    if (!userExists(db, addCvInput.owner)) {
      throw new Error(`User with id ${addCvInput.owner} is undefined`);
    }

    addCvInput.skills.forEach((newSkillId: number) => {
      if (!skillExists(db, newSkillId)) {
        throw new Error(`Skill with id ${newSkillId} is undefined`);
      }
    });

    const newCv = {
      id: db.cvs[db.cvs.length - 1].id + 1,
      ...addCvInput,
    };
    db.cvs.push(newCv);
    return newCv;
  },

  updateCv: (
    parent: any,
    { updateCvInput }: { updateCvInput: CvUpdateInput },
    { db }: any,
    info: any
  ) => {
    if (!cvExists(db, updateCvInput.id)) {
      throw new Error(`Cv with id ${updateCvInput.id} is undefined`);
    }

    if (updateCvInput.owner && !userExists(db, updateCvInput.owner)) {
      throw new Error(`User with id ${updateCvInput.owner} is undefined`);
    }

    updateCvInput.skills.forEach((newSkillId: number | null) => {
      if (newSkillId && !skillExists(db, newSkillId)) {
        throw new Error(`Skill with id ${newSkillId} is undefined`);
      }
    });

    let cvIndex = db.cvs.findIndex(
      (cv: { id: number }) => cv.id === updateCvInput.id
    );

    db.cvs[cvIndex] = {
      ...db.cvs[cvIndex],
      ...updateCvInput,
    };

    return db.cvs[cvIndex];
  },

  deleteCv: (parent: any, { id }: { id: string }, { db }: any, info: any) => {
    if (!cvExists(db, +id)) {
      throw new Error(`Cv with id ${id} is undefined`);
    }

    const deletedCv = db.cvs.find((cv: { id: number }) => cv.id === +id);

    db.cvs = db.cvs.filter((cv: { id: number }) => cv.id !== +id);

    return deletedCv;
  },
};

const userExists = (db: any, owner: number) =>
  db.users.some((user: { id: number }) => user.id === owner);

const skillExists = (db: any, newSkillId: number) =>
  db.skills.some((skill: { id: number }) => skill.id === newSkillId);

const cvExists = (db: any, cvId: number) =>
  db.cvs.some((cv: { id: number }) => cv.id === cvId);
