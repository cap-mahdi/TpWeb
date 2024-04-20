import { Cv } from "./Cv";

export enum MutationType {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export type CvSubscriptionReturn = {
  cv: Cv;
  mutation: MutationType;
};
