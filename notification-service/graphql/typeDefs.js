const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type Notification {

    id: ID!

    message: String!

    type: String!

    isRead: Boolean!

    createdAt: String

    updatedAt: String
  }

  type Query {

    getNotifications: [Notification]

    getNotification(id: ID!): Notification
  }

  type Mutation {

    createNotification(
      message: String!
      type: String
    ): Notification

    markAsRead(
      id: ID!
    ): Notification
  }
`;

module.exports = typeDefs;