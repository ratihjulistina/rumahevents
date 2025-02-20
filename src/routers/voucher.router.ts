import { Router } from "express";
import voucherController from "../controllers/voucher.controller";

export const voucherRouter = () => {
  const router = Router();

  router.get("/", voucherController.getVoucher);
  router.get("/validate", voucherController.getVoucher);
  router.post("/", voucherController.createVoucher);
  router.delete("/:id", voucherController.deleteVoucher);
  router.patch("/:id", voucherController.updateVoucher);

  return router;
};
