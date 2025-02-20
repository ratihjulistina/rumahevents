/** @format */

import { Prisma } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../config";
import { pagination } from "../helpers/pagination";

class VoucherService {
  async create(req: Request) {
    console.log("jhkhjhkj");
    const { code, discount, valid_from, valid_to, event_id } = req.body;
    const data: Prisma.VoucherCreateInput = {
      code,
      discount,
      valid_from,
      valid_to,

      event: {
        connect: {
          id: event_id,
        },
      },
    };

    console.log("data bosque " + data);

    try {
      await prisma.voucher.create({
        data,
      });
    } catch (error) {
      console.log("ERROR ????? " + error);
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
    const { page, code } = req.query;
    return await prisma.voucher.findMany({
      where: {
        code: {
          contains: String(code || ""),
        },
      },
      ...pagination(Number(page)),
    });
  }
}

export default new VoucherService();
