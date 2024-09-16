// decode jwt token and add the user to the request object

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

export const jwtDecode =  (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, env.JWT_SECRET as string);
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};