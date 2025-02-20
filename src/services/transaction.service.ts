/** @format */

import { Prisma } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../config";
import { pagination } from "../helpers/pagination";
import { ErrorHandler } from "../helpers/response.handler";

class TransactionService {
  async create(req: Request) {
    const { user_id, event_id, quantity } = req.body;

    try {
      if (!user_id || !event_id || !quantity) {
        throw new ErrorHandler("Missing required fields", 400);
      }
      const event = await prisma.event.findUnique({
        where: { id: event_id },
      });

      if (!event) {
        throw new ErrorHandler("Event not found!", 404);
      }
      if (event.available_seats < quantity) {
        throw new ErrorHandler("Not enough available seats", 400);
      }
      await prisma.event.update({
        where: { id: event_id },
        data: { available_seats: event.available_seats - quantity },
      });

      const totalPrice = parseFloat(event.price.toString()) * quantity;
      const data: Prisma.TransactionCreateInput = {
        user_id,
        no_invoice: "INV" + new Date().valueOf(),
        event: { connect: { id: event_id } },
        quantity,
        price: totalPrice,
        status: "Waiting_For_Payment",
      };

      // if (coupon_id) {
      //   data.coupon = { connect: { id: coupon_id } };
      // }

      const transaction = await prisma.transaction.create({
        data,
      });
      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async update(req: Request) {
    const id = Number(req.params.id);
    const { code, discount, valid_from, valid_to } = req.body;
    const data: Prisma.VoucherUpdateInput = {};
    if (code) data.code = code;
    if (discount) data.discount = discount;
    if (valid_from) data.valid_from = valid_from;
    if (valid_to) data.valid_to = valid_to;

    await prisma.voucher.update({
      data,
      where: { id },
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

  async getValidateList(req: Request) {
    const { code, event_id } = req.query;
    return await prisma.voucher.findFirst({
      where: {
        code: code as string,
        event_id: Number(event_id),
        valid_from: { lte: new Date() },
        valid_to: { gte: new Date() },
      },
    });
  }

  async getList(req: Request) {
    return await prisma.transaction.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getListByUser(req: Request) {
    const { id } = req.params;
    console.log("ini USERID YAA,", id);

    try {
      const tickets = await prisma.transaction.findMany({
        where: { user_id: Number(id), deleted_at: null },
        include: { event: true },
      });
      return tickets.map((ticket) => ({
        id: ticket.id,
        no_invoice: ticket.no_invoice,
        event_id: ticket.event_id,
        event_name: ticket.event.name,
        event_date: ticket.event.start_date,
        price: ticket.price,
        status: ticket.status,
        quantity: ticket.quantity,
      }));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }
}

export default new TransactionService();
