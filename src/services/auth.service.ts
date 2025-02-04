/** @format */

import { Request } from "express";
import { jwt_secret, prisma } from "../config";
import { Prisma } from "@prisma/client";
import { hashedPassword } from "../helpers/bcrypts";
import { getUserByEmail } from "../helpers/user.prisma";
import { ErrorHandler } from "../helpers/response.handler";
import { compare } from "bcrypt";
import { UserLogin } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";

class AuthService {
  async signIn(req: Request) {
    const { email, password } = req.body;

    const user = (await getUserByEmail(email)) as UserLogin;
    if (!user) throw new ErrorHandler("wrong email", 401);
    else if (!(await compare(password, user.password as string)))
      throw new ErrorHandler("wrong password");

    delete user.password;
    const access_token = sign(user, jwt_secret, { expiresIn: "20m" });

    return {
      access_token,
    };

    // return await prisma.user.findUnique({
    //   select: {
    //     id: true,
    //     first_name: true,
    //     last_name: true,
    //     role: true,
    //     img_src: true,
    //   },
    //   where: {
    //     email,
    //     password,
    //   },
    // });
  }

  async signUp(req: Request) {
    const { email, password, first_name, last_name } = req.body;

    await prisma.user.create({
      data: {
        email,
        password: await hashedPassword(password),
        first_name,
        last_name,
      },
    });
  }

  async updateUser(req: Request) {
    const { password, first_name, last_name, img_src } = req.body;
    const id = Number(req.params.id);
    const data: Prisma.UserUpdateInput = {};
    if (img_src) data.img_src = img_src;
    if (password) data.password = password;
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;

    await prisma.user.update({
      data,
      where: {
        id,
      },
    });
    return await prisma.user.findUnique({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        role: true,
        img_src: true,
      },
      where: {
        id,
      },
    });
  }
}

export default new AuthService();
