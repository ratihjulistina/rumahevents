import { Router } from "express";
import reviewController from "../controllers/review.controller";

export const reviewRouter = () => {
  const router = Router();

  router.get("/", reviewController.getReview);
  router.post("/", reviewController.createReview);
  router.delete("/:id", reviewController.deleteReview);
  router.patch("/:id", reviewController.updateReview);

  return router;
};
