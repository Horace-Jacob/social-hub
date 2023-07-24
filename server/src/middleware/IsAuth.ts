import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "src/utils/Interfaces";

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "jwtauthorization") as DecodedToken;
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.json({ success: false, message: "Invalid Token" });
    }
  } else {
    res.send("Authorization header missing");
  }
};
