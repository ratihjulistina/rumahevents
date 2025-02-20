import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import categoryService from "../services/category.service";

class CategoryController {
  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.getCategories(req);
      //   res.json(data);
      console.log("HALOOOOOOO" + data);
      responseHandler(res, "fetching category", data);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
