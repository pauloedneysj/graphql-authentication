import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface Token {
  token: string;
}

export const resolvers = {
  Query: {
    me: async (_parents, data: Token, context) => {
      const dbToken = await prisma.token.findUnique({
        where: { token: data.token },
        include: { user: true },
      });

      if (!dbToken) return null;

      const { user } = dbToken;

      return user;
    },
  },

  Mutation: {
    signUp: async (_parents, user: User, context) => {
      const hashedPassword = await hash(user.password, 10);

      return prisma.user.create({
        data: { ...user, password: hashedPassword },
      });
    },

    login: async (_parents, { email, password }: User, context) => {
      const user = await prisma.user.findUnique({ where: { email: email } });

      if (!user) return null;

      const validation = await compare(password, user.password);

      if (!validation) return null;

      return prisma.token.create({
        data: { token: uuid(), user: { connect: { id: user.id } } },
      });
    },
  },
};
