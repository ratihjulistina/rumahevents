import { prisma } from "../config";

export const getUserByEmail = async (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });
