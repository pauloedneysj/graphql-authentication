import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Context {
  prisma: PrismaClient;
  userId: string;
}

export interface JwtPayload {
  userId: string;
}

export const APP_SECRET = "graphql";

export const createToken = (id: string) => {
  return jwt.sign({ userId: id }, APP_SECRET, {
    expiresIn: "1d",
  });
};

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token) as JwtPayload;
      return userId;
    }
  }

  throw new Error("Not authenticated");
}
