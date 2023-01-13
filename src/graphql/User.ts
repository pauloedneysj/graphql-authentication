import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar ISODate

  type User {
    id: String
    email: String
    password: String
    firstName: String
    lastName: String
    createdAt: ISODate
    updatedAt: ISODate
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    me: User!
    users: [User!]
  }

  type Mutation {
    signUp(
      email: String
      password: String
      firstName: String
      lastName: String
    ): AuthPayload
    login(email: String, password: String): AuthPayload
  }
`;
