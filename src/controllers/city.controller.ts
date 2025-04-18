import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

// Controller untuk endpoint create city
exports.createCity = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    const slug = slugify(name, { lower: true });

    const existingCity = await prisma.city.findFirst({
      where: {
        OR: [{ name: name }, { slug: slug }],
      },
    });

    if (existingCity) {
      return res.status(400).json({
        error: true,
        message: "City with this name already exists",
      });
    }

    const city = await prisma.city.create({
      data: {
        name,
        slug,
      },
    });
    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk endpoint get cities
exports.getCities = async (req: Request, res: Response): Promise<Response> => {
  try {
    const cities = await prisma.city.findMany();

    return res.status(200).json({
      success: true,
      message: "Cities retrieved successfully",
      data: cities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk endpoint get city by slug
exports.getCityBySlug = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { slug } = req.params;

    const city = await prisma.city.findUnique({
      where: { slug },
    });

    if (!city) {
      return res.status(404).json({
        error: true,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City details retrieved successfully",
      data: city,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// Controller untuk endpoint delete city
exports.deleteCity = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Konversi id ke number
    const cityId = parseInt(id, 10);

    if (isNaN(cityId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid city ID",
      });
    }

    const city = await prisma.city.delete({
      where: { id: cityId },
    });

    if (!city) {
      return res.status(404).json({
        error: true,
        message: "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
      data: city,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
