/** @format */

import { Prisma } from "@prisma/client";
import { Request } from "express";
import { slugGenerator } from "../helpers/slug.generator";
import { prisma } from "../config";
import { pagination } from "../helpers/pagination";
import { cloudinaryUpload } from "../helpers/cloudinary";

class EventService {
  async create(req: Request) {
    console.log("jhkhjhkj");
    const {
      name,
      description,
      location,
      available_seats,
      created_by,
      price,
      image_src,
      start_date,
      end_date,
      category_ids,
    } = req.body;
    const data: Prisma.EventCreateInput = {
      name,
      description,
      location,
      available_seats: Number(available_seats),
      created_by,
      slug: slugGenerator(name),
      price,
      image_src,
      start_date: start_date + ":00Z",
      end_date: end_date + ":00Z",
      category: {
        connect: category_ids.map((id: number) => ({ id })),
      },

      //   creator: {
      //     connect: {
      //       id: created_by,
      //     },
      //   },
    };

    console.log("data bosque " + data);

    try {
      return await prisma.event.create({
        data,
        include: { category: true },
      });
    } catch (error) {
      console.log("ERROR ????? " + error);
    }
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
    const slug = req.query.slug as string;
    console.log("ini slug", slug);
    return prisma.event.findUnique({
      where: {
        slug,
        deleted_at: null,
      },
    });
  }
  async getNewestEvent(req: Request) {
    return await prisma.event.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },

      take: 8,
    });
  }

  async getNearestEvent(req: Request) {
    return await prisma.event.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        start_date: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        start_date: true,
        end_date: true,
        available_seats: true,
        price: true,
        image_src: true,
      },
      take: 8,
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

  async getEventsByQuery(req: Request) {
    const searchQuery = req.query.search as string;
    return await prisma.event.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      orderBy: {
        start_date: "asc",
      },
    });
  }

  async uploadImageEvent(req: Request) {
    const id = Number(req.query.iz);
    console.log("INI IDNYAAAA", req.query.iz);
    console.log("INI IDNYAAAAAA", id);
    const { file } = req;
    if (!file) throw new Error("No File Uploaded");
    const { secure_url } = await cloudinaryUpload(file);

    if (id) {
      await prisma.event.update({
        where: {
          id: id, // Update the event with the given eventId
        },
        data: {
          image_src: secure_url, // Save the Cloudinary URL in the image_src field
        },
      });
    } else {
      throw new Error("Event Id is not valid");
    }
  }
}

export default new EventService();
