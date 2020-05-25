const { gql } = require("apollo-server-express");

module.exports = gql`
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
