import { Router } from "express";
import transactionController from "../controllers/transaction.controller";

export const transactionRouter = () => {
  const router = Router();

  router.get("/", transactionController.getTransaction);
  router.get("/user/:id", transactionController.getTransactionByUser);
  router.post("/buy", transactionController.createTransaction);
  router.post("/:id/pay", transactionController.updatePaymentTransaction);
  router.post("/:id/expire", transactionController.expiredTransaction);
  router.delete("/:id", transactionController.deleteTransaction);
  router.patch("/update-status", transactionController.updateTransaction);

  return router;
};
