import { hash, compare } from "bcryptjs";
import { createToken, User, Context } from "../utils";

export const resolvers = {
  Query: {
    me: async (_parents, args, context: Context) => {
      const { userId } = context;

      const user = await context.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return null;

      return user;
    },

    users: async (_parents, args, context: Context) => {
      return await context.prisma.user.findMany();
    },
  },

  Mutation: {
    signUp: async (_parents, args: User, context: Context) => {
      const hashedPassword = await hash(args.password, 10);

      const newUser = await context.prisma.user.create({
        data: { ...args, password: hashedPassword },
      });

      const token = createToken(newUser.id);

      const userWithToken = await context.prisma.token.create({
        data: { token: token, user: { connect: { id: newUser.id } } },
        include: { user: true },
      });
      const signUpResponse = {
        token: userWithToken.token,
        user: userWithToken.user,
      };

      return signUpResponse;
    },

    login: async (_parents, { email, password }: User, context: Context) => {
      const user = await context.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) return null;

      const validation = await compare(password, user.password);

      if (!validation) return null;

      const token = createToken(user.id);

      const userWithToken = await context.prisma.token.create({
        data: { token: token, user: { connect: { id: user.id } } },
        include: { user: true },
      });

      const loginResponse = {
        token: userWithToken.token,
        user: userWithToken.user,
      };

      return loginResponse;
    },
  },
};
