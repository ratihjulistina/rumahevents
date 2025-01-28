/** @format */

import { Prisma } from "@prisma/client";
import { Request } from "express";
import { slugGenerator } from "../helpers/slug.generator";
import { prisma } from "../config";
import { pagination } from "../helpers/pagination";

class EventService {
  async create(req: Request) {
    const {
      name,
      image_src,
      price,
      location,
      available_seats,
      description,
      start_date,
      end_date,
      created_by,
    } = req.body;
    const data: Prisma.EventCreateInput = {
      name,
      image_src,
      price,
      location,
      available_seats,
      description,
      start_date,
      end_date,
      slug: slugGenerator(name),
      creator: {
        connect: {
          id: created_by,
        },
      },
    };

    await prisma.event.create({
      data,
    });
  }
  async update(req: Request) {
    const id = Number(req.params.id);
    const { name, image_src, price, location, available_seats, description } =
      req.body;
    const data: Prisma.EventUpdateInput = {};
    if (name) data.name = name;
    if (image_src) data.image_src = image_src;
    if (price) data.price = price;
    if (location) data.location = location;
    if (available_seats) data.available_seats = available_seats;
    if (description) data.description = description;

    await prisma.event.update({
      data,
      where: { id, deleted_at: null },
    });
  }
  async delete(req: Request) {
    const id = Number(req.params.id);
    await prisma.event.update({
      data: {
        deleted_at: new Date(),
      },
      where: {
        id,
      },
    });
  }
  async getBySlug(req: Request) {
    const { slug } = req.params;
    return prisma.event.findUnique({
      where: {
        slug,
        deleted_at: null,
      },
    });
  }
  async getList(req: Request) {
    const { page, name } = req.query;
    return await prisma.event.findMany({
      where: {
        name: {
          contains: String(name || ""),
        },
        deleted_at: null,
      },
      ...pagination(Number(page)),
    });
  }
}

export default new EventService();
