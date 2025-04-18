import { Request, Response, NextFunction } from "express";

const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      if (req.user.role === "user") {
        res.status(403).json({
          message: "You don't have permission to access this resource",
        });
        return;
      }

      if (req.user.role === "admin") {
        next();
      }
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  };
};

export default checkRole;
