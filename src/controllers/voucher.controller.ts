import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import voucherService from "../services/voucher.service";

class VoucherController {
  async createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      await voucherService.create(req);
      responseHandler(res, "new voucher has been created", undefined, 201);
    } catch (error) {
      next(error);
    }
  }
  async updateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await voucherService.update(req);
      responseHandler(res, "new voucher has been updated", data);
    } catch (error) {
      next(error);
    }
  }

  async deleteVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      await voucherService.delete(req);
      responseHandler(res, "voucher has been deleted");
    } catch (error) {
      next(error);
    }
  }

  async getVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await voucherService.getList(req);
      responseHandler(res, "fetching voucher", data);
    } catch (error) {
      next(error);
    }
  }

  async getValidateVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await voucherService.getValidateList(req);
      responseHandler(res, "fetching the voucher", data);
    } catch (error) {
      next(error);
    }
  }
}

export default new VoucherController();
