import express from "express";
import { Router } from "express";
import checkRole from "../middlewares/checkRole";
import upload from "../config/uploadImage";

const router: Router = express.Router();
const authenticateToken = require("../lib/authenticateToken");
const eventController = require("../controllers/event.controller");

// endpoint untuk membuat event
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  upload.single("image"),
  eventController.createEvent
);

// endpoint untuk mendapatkan semua event
router.get("/", authenticateToken, eventController.getAllEvents);

// endpoint untuk mendapatkan detail event berdasarkan ID
router.get("/:id", authenticateToken, eventController.getEventById);

// endpoint untuk mengupdate event berdasarkan ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  upload.single("image"),
  eventController.updateEvent
);

// endpoint untuk menghapus event berdasarkan ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  eventController.deleteEvent
);

module.exports = router;
