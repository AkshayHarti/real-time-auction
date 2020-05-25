const { gql } = require("apollo-server-express");

module.exports = gql`
  type Request {
    _id: ID!
    dueDate: String
    status: String
    event: RequestEvent
  }

  type Proposal {
    _id: ID!
    requestId: ID!
    status: String
  }

  enum RequestEvent {
    REQUEST_SUBMITTED
    REQUEST_CLOSED
    REQUEST_EXTENDED
  }

  type Query {
    getRequests: [Request]!
    getProposals: [Proposal]!
    getTimeouts: [ID]!
  }

  type Mutation {
    createRequest: ID!
    submitRequest(_id: ID!, dueDate: String!): Request!
    updateRequest(_id: ID!): Request!
    closeRequest(_id: ID!): Request!
    addProposal(requestId: ID!, status: String!): Proposal!
    updateProposal(_id: ID!): String!
  }

  type Subscription {
    requestEvent: Request!
  }
`;
