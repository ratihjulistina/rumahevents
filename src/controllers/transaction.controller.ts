import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import transactionService from "../services/transaction.service";

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionService.create(req);
      responseHandler(
        res,
        "new transaction has been created",
        transaction,
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.update(req);
      responseHandler(res, "new transaction has been updated", data);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionService.delete(req);
      responseHandler(res, "transaction has been deleted");
    } catch (error) {
      next(error);
    }
  }

  async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.getList(req);
      responseHandler(res, "fetching transaction", data);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.getListByUser(req);

      console.log("INIDATA TIKEETT", data);
      responseHandler(res, "fetching transaction", data);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await transactionService.updatePayment(req);
      responseHandler(res, "new event has been updated", data);
    } catch (error) {
      next(error);
    }
  }

  async expiredTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.updatePaymentExpired(req);
      responseHandler(res, "new event has been updated", data);
    } catch (error) {
      next(error);
    }
  }
  //   async getValidateVoucher(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const data = await voucherService.getValidateList(req);
  //       responseHandler(res, "fetching the voucher", data);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

export default new TransactionController();
