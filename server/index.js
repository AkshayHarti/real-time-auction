const { ApolloServer, PubSub } = require("apollo-server-express");
const http = require("http");
const express = require("express");
const schema = require("./schema");
const agenda = require("./agenda");
const addRequest = require("./resolvers/addRequest");
const closeRequest = require("./resolvers/closeRequest");
const addProposal = require("./resolvers/addProposal");
const updateProposal = require("./resolvers/updateProposal");

const pubsub = new PubSub();

const constants = {
  REQUEST_EVENT: "REQUEST_EVENT",
};

const resolvers = {
  Query: {
    getRequests: (_, __, { requests }) => requests,
    getProposals: (_, __, { proposals }) => proposals,
    getTimeouts: (_, __, { timeouts }) => Object.keys(timeouts),
  },
  Mutation: {
    addRequest,
    closeRequest,
    addProposal,
    updateProposal,
  },
  Subscription: {
    requestEvent: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([constants.REQUEST_EVENT]),
    },
  },
};

const app = express();
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    requests: [],
    proposals: [],
    timeouts: {},
    pubsub,
    agenda: agenda(pubsub, constants),
    constants,
  },
});

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
