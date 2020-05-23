const { ApolloServer, PubSub, gql } = require("apollo-server-express");
const http = require("http");
const express = require("express");
const uuid = require("uuid");

/**
 * @param: _id
 * @param: dueDate
 */
const requests = [];

const timeouts = {};

const pubsub = new PubSub();
const TIMER_PASSED = "TIMER_PASSED";
const TIMER_UPDATED = "TIMER_UPDATED";

const schema = gql`
  type Request {
    _id: ID!
    dueDate: String!
    status: String!
  }

  type Query {
    getRequests: [Request]!
  }

  type Mutation {
    addRequest(dueDate: String!, status: String!): Boolean
    updateRequest(_id: ID!): Request!
  }

  type Subscription {
    timerPassed: Request!
    timerUpdated: Request!
  }
`;

const setAgenda = ({ _id, dueDate, index }) =>
  setTimeout(() => {
    clearTimeout(timeouts[_id]);
    delete timeouts[_id];
    requests[index].status = "closed";
    pubsub.publish(TIMER_PASSED, {
      timerPassed: requests[index],
    });
  }, new Date(dueDate) - new Date());

const resolvers = {
  Query: {
    getRequests: () => requests,
  },
  Mutation: {
    addRequest: (_, { dueDate, status }) => {
      const _id = uuid.v4();
      requests.push({ _id, dueDate, status });
      const index = requests.length - 1;
      timeouts[_id] = setAgenda({ _id, dueDate, index });
      return true;
    },
    updateRequest: (_, { _id }) => {
      const index = requests.findIndex((request) => request._id === _id);

      let dueDate = requests[index].dueDate;
      dueDate = new Date(new Date(dueDate).getTime() + 60000).toISOString();
      clearTimeout(timeouts[_id]);
      timeouts[_id] = setAgenda({ _id, dueDate, index });
      pubsub.publish(TIMER_UPDATED, {
        timerUpdated: requests[index],
      });

      requests[index] = { ...requests[index], dueDate };
      return requests[index];
    },
  },
  Subscription: {
    timerPassed: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([TIMER_PASSED]),
    },
    timerUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([TIMER_UPDATED]),
    },
  },
};

const app = express();
const server = new ApolloServer({ typeDefs: schema, resolvers });

server.applyMiddleware({ app });

const PORT = 4000;

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});

// The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
