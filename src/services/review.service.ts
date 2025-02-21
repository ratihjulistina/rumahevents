/** @format */

import { Prisma } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../config";
import { pagination } from "../helpers/pagination";
import { ErrorHandler } from "../helpers/response.handler";

class ReviewService {
  async create(req: Request) {
    const { description, rating, event_id, user_id } = req.body;
    try {
      const review = await prisma.review.create({
        data: {
          description,
          rating,
          event_id,
          user_id,
        },
      });

      return review;
    } catch (err) {
      new ErrorHandler("Failed to create review", 500);
    }
  }
  async update(req: Request) {
    const id = Number(req.params.id);
    const { description, rating, event_id, user_id } = req.body;
    const data: Prisma.ReviewUpdateInput = {};

    await prisma.review.update({
      data,
      where: { id },
    });
  }
  async delete(req: Request) {
    const id = Number(req.params.id);
    await prisma.review.update({
      data: {},
      where: {
        id,
      },
    });
  }

  async getList(req: Request) {
    // const { eventIds } = req.query;

    try {
      const reviews = await prisma.review.findMany({
        // where: {
        // //   event_id: Number(eventIds),
        // id,
        // },
      });

      return reviews;
    } catch (err) {
      return new ErrorHandler("Failed to fetch reviews", 500);
    }
  }

  async getListReview(req: Request) {
    return await prisma.transaction.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }
}

export default new ReviewService();
