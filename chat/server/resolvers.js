import { GraphQLError } from 'graphql';
import { createMessage, getMessages } from './db/messages.js';
import {PubSub} from "graphql-subscriptions";
const pubsub = new PubSub();
export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = createMessage(user, text);
      await pubsub.publish("MESSAGE_ADDED", {messageAdd: message});
      return message;
    },
  },

  Subscription: {
    messageAdd: {
      subscribe: (_root, _args, {user}) => {
        if (!user) throw unauthorizedError();
        return pubsub.asyncIterator("MESSAGE_ADDED");}
    }
  }
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
