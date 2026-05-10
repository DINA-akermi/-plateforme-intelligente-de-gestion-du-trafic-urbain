const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Incident {

    id: ID!
    title: String!
    description: String!
    type: String!
    status: String!
    latitude: Float!
    longitude: Float!
  }

  type Query {

    incidents: [Incident]

    incident(id: ID!): Incident
  }

  type Mutation {

    createIncident(
      title: String!
      description: String!
      type: String!
      latitude: Float!
      longitude: Float!
    ): Incident

    updateIncidentStatus(
      id: ID!
      status: String!
    ): Incident

    deleteIncident(id: ID!): String
  }
`;

module.exports = typeDefs;