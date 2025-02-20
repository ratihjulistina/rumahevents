import { Router } from "express";
import categoryController from "../controllers/category.controller";

export const categoryRouter = () => {
  const router = Router();

  router.get("/", categoryController.getCategory);
  //   router.post("/", voucherController.createVoucher);

  return router;
};
