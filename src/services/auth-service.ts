import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest, MyJwtPayload, DecodedUser } from "../types/Interface";
import { JWT_SECRET } from "../../config";


export default function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["token"] as string;
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token", error: e  });
  }
}
