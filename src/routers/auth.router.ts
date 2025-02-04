/** @format */

import { Router } from "express";
import authController from "../controllers/auth.controller";
//import { verifyUser } from "../middlewares/auth.middleware";

export const authRouter = () => {
  const router = Router();

  router.post("/new", authController.signUp);
  router.post("/", authController.signIn);
  // router.patch("/", verifyUser, authController.updateUser);
  router.patch("/", authController.updateUser);
  return router;
};
