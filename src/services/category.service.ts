import { Request } from "express";
import { prisma } from "../config";

class CategoryService {
  async getCategories(req: Request) {
    return await prisma.category.findMany();
  }
}
export default new CategoryService();
