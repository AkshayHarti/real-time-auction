const { ApolloServer, PubSub, gql } = require("apollo-server-express");
const http = require("http");
const express = require("express");
const uuid = require("uuid");

/**
 * @param: _id
 * @param: dueDate
 */
const requests = [];
const proposals = [];
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

  type Proposal {
    _id: ID!
    requestId: ID!
    status: String!
  }

  type Query {
    getRequests: [Request]!
    getProposals: [Proposal]!
    getTimeouts: [ID]!
  }

  type Mutation {
    addRequest(dueDate: String!, status: String!): Request!
    updateRequest(_id: ID!): Request!
    closeRequest(_id: ID!): Request!
    addProposal(requestId: ID!, status: String!): Proposal!
    updateProposal(_id: ID!): String!
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
    getProposals: () => proposals,
    getTimeouts: () => Object.keys(timeouts),
  },
  Mutation: {
    addRequest: (_, { dueDate, status }) => {
      const _id = uuid.v4();
      requests.push({ _id, dueDate, status });
      const index = requests.length - 1;
      timeouts[_id] = setAgenda({ _id, dueDate, index });
      return requests[index];
    },
    closeRequest: (_, { _id }) => {
      const index = requests.findIndex((request) => request._id === _id);
      if (index === -1) {
        throw new Error("Request not found!");
      }
      clearInterval(timeouts[_id]);
      delete timeouts[_id];

      requests[index] = { ...requests[index], status: "closed" };
      return requests[index];
    },
    addProposal: (_, { requestId, status }) => {
      const _id = uuid.v4();
      const index = requests.findIndex((request) => request._id === requestId);
      if (index === -1) {
        throw new Error("Request not present");
      }
      const currentProposal = { _id, requestId, status };
      proposals.push(currentProposal);

      const dueDate = new Date(
        new Date(requests[index].dueDate).getTime() + 60000
      ).toISOString();

      clearTimeout(timeouts[requests[index]._id]);
      timeouts[requests[index]._id] = setAgenda({
        _id: requests[index]._id,
        dueDate,
        index,
      });

      pubsub.publish(TIMER_UPDATED, {
        timerUpdated: requests[index],
      });

      requests[index] = { ...requests[index], dueDate };
      return currentProposal;
    },
    updateProposal: (_, { _id }) => {
      const proposal = proposals.find((proposal) => proposal._id === _id);
      if (!proposal) {
        throw new Error("Proposal not found!");
      }
      const requestIndex = requests.findIndex(
        (request) => request._id === proposal.requestId
      );

      const dueDate = new Date(
        new Date(requests[requestIndex].dueDate).getTime() + 60000
      ).toISOString();

      clearTimeout(timeouts[requests[requestIndex]._id]);
      timeouts[requests[requestIndex]._id] = setAgenda({
        _id: requests[requestIndex]._id,
        dueDate,
        index: requestIndex,
      });

      pubsub.publish(TIMER_UPDATED, {
        timerUpdated: requests[requestIndex],
      });

      requests[requestIndex] = { ...requests[requestIndex], dueDate };
      return `Request due date is after ${(
        (new Date(dueDate) - new Date()) /
        60000
      ).toFixed(2)} minutes`;
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
