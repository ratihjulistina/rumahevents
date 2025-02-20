import express, { Application, NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import { ErrorHandler } from "./helpers/response.handler";
import { eventRouter } from "./routers/event.router";
import { authRouter } from "./routers/auth.router";
import cors from "cors";
import { voucherRouter } from "./routers/voucher.router";
import { categoryRouter } from "./routers/category.router";
import { transactionRouter } from "./routers/transaction.router";
// import { authRouter } from "./routers/auth.router";
// import { transactionRouter } from "./routers/transaction.router";

export class App {
  private app: Application;
  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private routes() {
    this.app.use("/api/events", eventRouter());
    this.app.use("/api/auth", authRouter());
    this.app.use("/api/vouchers", voucherRouter());
    this.app.use("/api/categories", categoryRouter());
    this.app.use("/api/tickets", transactionRouter());
  }

  private configure() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private handleError() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send("Not found !");
    });

    this.app.use(
      (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        res.status(err.code || 500).send({
          message: err.message,
        });
      }
    );
  }

  start() {
    this.app.listen(PORT, () => {
      console.log("rumahevents API is running on PORT ", PORT);
    });
  }
}
