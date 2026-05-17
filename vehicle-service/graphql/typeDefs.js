const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Vehicle {
    id: ID!
    plateNumber: String!
    model: String
    type: String
    status: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getVehicles: [Vehicle]
    getVehicle(id: ID!): Vehicle
  }

  type Mutation {
    createVehicle(
      plateNumber: String!
      model: String
      type: String
      status: String
    ): Vehicle

    updateVehicleStatus(
      id: ID!
      status: String!
    ): Vehicle

    deleteVehicle(id: ID!): String
  }
`;

module.exports = typeDefs;
