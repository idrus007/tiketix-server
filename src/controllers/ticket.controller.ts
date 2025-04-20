import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller untuk membuat tiket
exports.createTicket = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { eventId, name, price, quantity } = req.body;

    if (!eventId || !name || price == null || quantity == null) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    const eventIdInt = parseInt(eventId);
    const priceInt = parseInt(price);
    const quantityInt = parseInt(quantity);

    // Validasi angka
    if (isNaN(eventIdInt) || isNaN(priceInt) || isNaN(quantityInt)) {
      return res.status(400).json({
        error: true,
        message: "eventId, price, and quantity must be valid numbers",
      });
    }

    if (priceInt < 0 || quantityInt <= 0) {
      return res.status(400).json({
        error: true,
        message: "Price must be >= 0 and quantity must be > 0",
      });
    }

    // Cek event
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventIdInt },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: true,
        message: "Event not found",
      });
    }

    // Buat tiket baru
    const ticket = await prisma.ticket.create({
      data: {
        eventId: eventIdInt,
        name,
        price: priceInt,
        quantity: quantityInt,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk mendapatkan semua tiket
exports.getAllTickets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk mendapatkan detail tiket berdasarkan ID
exports.getTicketById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const ticketId = parseInt(req.params.id);

    if (isNaN(ticketId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Get ticket detail error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk memperbarui tiket (eventId tidak bisa diubah)
exports.updateTicket = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const ticketId = parseInt(req.params.id);
    const { name, price, quantity } = req.body;

    if (isNaN(ticketId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid ticket ID",
      });
    }

    if (!name && price == null && quantity == null) {
      return res.status(400).json({
        error: true,
        message:
          "At least one field (name, price, quantity) is required to update",
      });
    }

    // Ambil tiket lama
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return res.status(404).json({
        error: true,
        message: "Ticket not found",
      });
    }

    // Persiapkan data update
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (price != null) {
      const priceInt = parseInt(price);
      if (isNaN(priceInt) || priceInt < 0) {
        return res.status(400).json({
          error: true,
          message: "Price must be a valid number >= 0",
        });
      }
      updatedData.price = priceInt;
    }
    if (quantity != null) {
      const quantityInt = parseInt(quantity);
      if (isNaN(quantityInt) || quantityInt <= 0) {
        return res.status(400).json({
          error: true,
          message: "Quantity must be a valid number > 0",
        });
      }
      updatedData.quantity = quantityInt;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: updatedData,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk menghapus tiket
exports.deleteTicket = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticketId = parseInt(id);
    if (isNaN(ticketId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid ticket ID",
      });
    }
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: "Ticket not found",
      });
    }
    await prisma.ticket.delete({
      where: { id: ticketId },
    });
    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
