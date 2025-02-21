import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import reviewService from "../services/review.service";

class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.create(req);
      console.log("INI REVIEWNYAA", review);
      responseHandler(res, "new review has been created", review, 201);
    } catch (error) {
      next(error);
    }
  }
  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.update(req);
      responseHandler(res, "new review has been updated", data);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await reviewService.delete(req);
      responseHandler(res, "review has been deleted");
    } catch (error) {
      next(error);
    }
  }

  async getReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reviewService.getList(req);
      responseHandler(res, "fetching review", data);
    } catch (error) {
      next(error);
    }
  }
}
export default new ReviewController();
