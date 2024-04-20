export type Cv = {
  id: number;
  name: string;
  age: number;
  job: string;
  user: number;
};

export type CvWithSkills = Cv & {
  skills: number[];
};
