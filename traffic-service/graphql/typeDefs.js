const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Traffic {
    id: ID!
    location: String!
    level: String!
    speed: Float
    createdAt: String
    updatedAt: String
  }

  type Query {

    # GET ALL TRAFFIC
    getTraffic: [Traffic]

    getTrafficById(id: ID!): Traffic
  }

  type Mutation {

    createTraffic(
      location: String!
      level: String
      speed: Float
    ): Traffic

    updateTrafficLevel(
      id: ID!
      level: String!
    ): Traffic

    deleteTraffic(
      id: ID!
    ): String
  }
`;

module.exports = typeDefs;