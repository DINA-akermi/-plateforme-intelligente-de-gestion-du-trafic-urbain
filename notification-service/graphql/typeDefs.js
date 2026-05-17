const { gql } = require("apollo-server-express");

const typeDefs = gql`
<<<<<<< HEAD
  type Notification {
    id: ID!
    message: String!
    type: String
    recipientRole: String
    isRead: Boolean
    createdAt: String
  }

  type Query {
    getNotifications: [Notification]
  }

  type Mutation {
    createNotification(
      message: String!
      type: String
      recipientRole: String
    ): Notification

    markAsRead(id: ID!): Notification
=======

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
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  }
`;

module.exports = typeDefs;