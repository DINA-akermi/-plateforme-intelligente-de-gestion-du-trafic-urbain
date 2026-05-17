const { gql } = require("apollo-server-express");

module.exports = gql`

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthResponse {
    token: String!
    user: User
  }

  type Query {

    me: User
  }

  type Mutation {

    register(
      name: String!
      email: String!
      password: String!
      role: String
    ): User

    login(
      email: String!
      password: String!
    ): AuthResponse
  }
`;