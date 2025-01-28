import { Router } from "express";
import eventController from "../controllers/event.controller";

export const eventRouter = () => {
  const router = Router();

  router.get("/", eventController.getEvent);
  router.get("/:slug", eventController.getEventBySlug);
  router.post("/", eventController.createEvent);
  router.delete("/:id", eventController.deleteEvent);
  router.patch("/:id", eventController.updateEvent);

  return router;
};
