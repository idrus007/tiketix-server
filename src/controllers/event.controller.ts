import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

// controller untuk membuat event
exports.createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Validasi input
    const { name, description, date, location } = req.body;

    // Menggunakan req.file untuk mendapatkan nama file gambar
    const image = req.file ? req.file.filename : null;

    // Validasi jika ada field yang kosong
    if (!name || !description || !date || !location || !image) {
      return res.status(400).json({
        error: true,
        message: "All fields including image are required",
      });
    }

    // membuat slug dari nama event
    const slug = slugify(name, { lower: true });

    // Cek apakah event dengan nama atau slug yang sama sudah ada
    const existingEvent = await prisma.event.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    // Validasi jika event sudah ada
    if (existingEvent) {
      return res.status(400).json({
        error: true,
        message: "Event with this name already exists",
      });
    }

    // Membuat event baru
    const event = await prisma.event.create({
      data: {
        name,
        slug,
        image,
        description,
        date,
        location,
      },
    });

    // Mengembalikan response sukses
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// controller untuk mendapatkan semua event
exports.getAllEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const events = await prisma.event.findMany();

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// controller untuk mendapatkan detail event berdasarkan ID
exports.getEventById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid event ID",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        error: true,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// controller untuk mengupdate event
exports.updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid event ID",
      });
    }

    const { name, description, date, location } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Validasi apakah event yang akan diupdate ada
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: true,
        message: "Event not found",
      });
    }

    const slug = name ? slugify(name, { lower: true }) : undefined;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        slug,
        image,
        description,
        date,
        location,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// controller untuk menghapus event
exports.deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid event ID",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: true,
        message: "Event not found",
      });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
