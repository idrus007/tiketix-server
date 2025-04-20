import express from "express";
import { Router } from "express";
import checkRole from "../middlewares/checkRole";

const router: Router = express.Router();
const authenticateToken = require("../lib/authenticateToken");
const ticketController = require("../controllers/ticket.controller");

// endpoint untuk membuat tiket
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  ticketController.createTicket
);

// endpoint untuk mendapatkan semua tiket
router.get(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  ticketController.getAllTickets
);

// endpoint untuk mendapatkan detail tiket berdasarkan ID
router.get(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  ticketController.getTicketById
);

// endpoint untuk mengupdate tiket berdasarkan ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  ticketController.updateTicket
);

// endpoint untuk menghapus tiket berdasarkan ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  ticketController.deleteTicket
);

module.exports = router;
