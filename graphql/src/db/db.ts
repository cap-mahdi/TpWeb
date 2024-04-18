export const db = {
  users: [
    {
      id: 1,
      email: "mehdi@fekih.com",
      name: "Mehdi fkih",
      role: "ADMIN",
    },
    {
      id: 2,
      email: "medamine@gdoura.com",
      name: "Med Amine Gdoura",
      role: "ADMIN",
    },
    {
      id: 3,
      email: "Mahdi@chaabane.com",
      name: "Mahdi Chaabane",
      role: "USER",
    },
    {
      id: 4,
      email: "mehdi@khelil.com",
      name: "Mehdi khelil",
      role: "USER",
    },
    {
      id: 5,
      email: "houssem@sahnoun.com",
      name: "Houssem Sahnoun",
      role: "ADMIN",
    },
  ],
  skills: [
    { id: 1, designation: "HTML" },
    { id: 2, designation: "CSS" },
    { id: 3, designation: "JavaScript" },
    { id: 4, designation: "React" },
    { id: 5, designation: "Node.js" },
    { id: 6, designation: "Python" },
    { id: 7, designation: "SQL" },
  ],
  cvs: [
    {
      id: 1,
      name: "Fake CV 1",
      age: 25,
      job: "Web Developer",
      user: 1,
      skills: [1, 3, 4],
    },
    {
      id: 2,
      name: "Fake CV 2",
      age: 28,
      job: "Frontend Developer",
      user: 2,
      skills: [2, 3, 4],
    },
    {
      id: 3,
      name: "Fake CV 3",
      age: 30,
      job: "Backend Developer",
      user: 3,
      skills: [5, 6, 7],
    },
    {
      id: 4,
      name: "Fake CV 4",
      age: 26,
      job: "Full Stack Developer",
      user: 4,
      skills: [1, 2, 3, 4, 5],
    },
    {
      id: 5,
      name: "Fake CV 5",
      age: 29,
      job: "Software Engineer",
      user: 5,
      skills: [3, 4, 5, 6],
    },
    {
      id: 6,
      name: "Fake CV 6",
      age: 27,
      job: "Data Scientist",
      user: 1,
      skills: [6, 7],
    },
    {
      id: 7,
      name: "Fake CV 7",
      age: 31,
      job: "UI/UX Designer",
      user: 2,
      skills: [1, 2],
    },
    {
      id: 8,
      name: "Fake CV 8",
      age: 24,
      job: "Network Engineer",
      user: 3,
      skills: [3, 4, 5],
    },
    {
      id: 9,
      name: "Fake CV 9",
      age: 32,
      job: "Project Manager",
      user: 4,
      skills: [1, 2, 5, 6],
    },
    {
      id: 10,
      name: "Fake CV 10",
      age: 26,
      job: "System Administrator",
      user: 5,
      skills: [3, 4, 7],
    },
  ],
};
