import { Router } from "express";
import eventController from "../controllers/event.controller";
import { uploader } from "../helpers/multer";

export const eventRouter = () => {
  const router = Router();

  router.get("/", eventController.getEvent);
  router.get("/q", eventController.getEventsByQuery);
  router.get("/newest", eventController.getNewestEvent);
  router.get("/nearest", eventController.getNearestEvent);
  router.get("/slug", eventController.getEventBySlug);
  router.post("/", eventController.createEvent);
  router.post(
    "/image",
    uploader().single("image"),
    eventController.addImageCloudinary
  );
  router.delete("/image", eventController.removeImageCloudinary);
  router.delete("/:id", eventController.deleteEvent);
  router.patch("/:id", eventController.updateEvent);

  return router;
};
