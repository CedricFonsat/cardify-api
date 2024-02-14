import Jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user-model";
import { RequestBodySignup } from "../types/Interface";
import { comparePassword, cryptPassword } from "../services/bcrypt-service";
import { JWT_SECRET } from "../../config";

export class authController {
  static async setSignup(req: Request, res: Response) {
    try {
      const userUsername = await User.findOne({ username: req.body.username });
      if (userUsername) {
        return res.status(400).json({ message: "USERNAME_ALREADY_EXISTS" });
      }
      const userEmail = await User.findOne({ email: req.body.email });
      if (userEmail) {
        return res.status(400).json({ message: "EMAIL_ALREADY_EXISTS" });
      }
      req.body.password = await cryptPassword(req.body.password);
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: "USER_CREATED", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async setSignin(req: Request, res: Response) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ message: "INVALID_USERNAME" });
      }

      const passwordMatch = comparePassword(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "INVALID_PASSWORD" });
      }

      const token = Jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
