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
    if (req.method === "POST") {
      const { ticket_id, status } = req.body;

      try {
        const ticket = await prisma.transaction.findUnique({
          where: { id: ticket_id },
        });

        if (!ticket) {
          return new ErrorHandler("Ticket not found", 404);
        }

        const event = await prisma.event.findUnique({
          where: { id: ticket.event_id },
        });

        if (!event) {
          return new ErrorHandler("Event not found", 404);
        }
        if (status === "Expired" || status === "Cancelled") {
          await prisma.event.update({
            where: { id: ticket.event_id },
            data: { available_seats: event.available_seats + ticket.quantity },
          });
        }

        return await prisma.transaction.update({
          where: { id: ticket_id },
          data: { status },
        });
        // return res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    } else {
      return new ErrorHandler("Method not allowed", 405);
    }
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
  async updatePayment(req: Request) {
    if (req.method === "POST") {
      const { ticketId } = req.query;
      const { bank, payment_proof } = req.body;

      try {
        // Update the transaction status
        await prisma.transaction.update({
          where: { id: Number(ticketId) },
          data: {
            status: "Waiting_For_Admin_Confirmation",
            payment_proof,
          },
        });

        // res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error updating transaction status:", error);
      }
    } else {
      return new ErrorHandler("Method not allowed", 405);
    }
  }
  async updatePaymentExpired(req: Request) {
    if (req.method === "POST") {
      const { ticketId } = req.query;

      try {
        // Fetch the ticket to get the event ID and quantity
        const ticket = await prisma.transaction.findUnique({
          where: { id: Number(ticketId) },
        });

        if (!ticket) {
          return new ErrorHandler("Ticket not found", 404);
        }

        // Fetch the event to update available seats
        const event = await prisma.event.findUnique({
          where: { id: ticket.event_id },
        });

        if (!event) {
          return new ErrorHandler("Event not found");
        }

        // Rollback available seats
        await prisma.event.update({
          where: { id: ticket.event_id },
          data: { available_seats: event.available_seats + ticket.quantity },
        });

        // Update the ticket status to Expired
        await prisma.transaction.update({
          where: { id: Number(ticketId) },
          data: { status: "Expired" },
        });

        // res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error expiring ticket:", error);
      }
    } else {
      throw new ErrorHandler("Method not allowed", 405);
    }
  }
}

export default new TransactionService();
