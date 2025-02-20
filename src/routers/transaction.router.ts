import { Router } from "express";
import transactionController from "../controllers/transaction.controller";

export const transactionRouter = () => {
  const router = Router();

  router.get("/", transactionController.getTransaction);
  router.post("/buy", transactionController.createTransaction);
  router.get("/user/:id", transactionController.getTransactionByUser);
  router.delete("/:id", transactionController.deleteTransaction);
  router.patch("/:id", transactionController.updateTransaction);

  return router;
};
