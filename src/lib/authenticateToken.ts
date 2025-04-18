import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/UserPayload";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).send("Unauthorized");
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: UserPayload) => {
    if (err) {
      return res.status(403).json({ message: "Access Denied: Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
