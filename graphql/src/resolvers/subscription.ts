import { PubSubEvents } from "../pubsub";
import { Context } from "../types";

export const Subscription = {
  notifyCv: {
    subscribe: (_: unknown, __: {}, { pubSub }: Context) => {
      return pubSub.subscribe(PubSubEvents.NOTIFY);
    },
  },
};
