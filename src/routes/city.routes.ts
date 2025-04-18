import express from "express";
import { Router } from "express";
import checkRole from "../middlewares/checkRole";

const router: Router = express.Router();
const authenticateToken = require("../lib/authenticateToken");
const cityController = require("../controllers/city.controller");

router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  cityController.createCity
);

router.get(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  cityController.getCities
);

router.get(
  "/:slug",
  authenticateToken,
  checkRole(["admin"]),
  cityController.getCityBySlug
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  cityController.deleteCity
);

module.exports = router;
