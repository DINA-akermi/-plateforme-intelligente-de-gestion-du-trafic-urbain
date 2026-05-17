const { gql } = require("apollo-server-express");

const typeDefs = gql`
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
  }
`;

module.exports = typeDefs;