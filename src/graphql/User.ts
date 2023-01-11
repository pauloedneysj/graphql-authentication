import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar ISODate

  type UserResponse {
    id: String
    email: String
    password: String
    firstName: String
    lastName: String
    createdAt: ISODate
    updatedAt: ISODate
  }

  type LoginResponse {
    token: String
  }

  type Query {
    me(token: String): UserResponse
  }

  type Mutation {
    signUp(
      email: String
      password: String
      firstName: String
      lastName: String
    ): UserResponse
    login(email: String, password: String): LoginResponse
  }
`;
