import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import eventService from "../services/event.service";

class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.create(req);
      responseHandler(res, "new event has been created", undefined, 201);
    } catch (error) {
      next(error);
    }
  }
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.update(req);
      responseHandler(res, "new event has been updated");
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.delete(req);
      responseHandler(res, "event has been deleted");
    } catch (error) {
      next(error);
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getList(req);
      responseHandler(res, "fetching event", data);
    } catch (error) {
      next(error);
    }
  }

  async getNewestEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getNewestEvent(req);
      responseHandler(res, "fetching the newest events", data);
    } catch (error) {
      next(error);
    }
  }

  async getEventBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getBySlug(req);
      if (!data) throw new ErrorHandler("event not found", 404);
      responseHandler(res, "fetching event with slug", data);
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
