import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { Document } from "mongoose";

export interface UserType extends Document {
 // _id: ObjectId;
  username: string;
  password: string;
  email: string;
  avatar: string;
  wallet: number;
  soldCards: [];
  createdAt: Date;
  updatedAt: Date;
  role: string;
  badge: string;
  cards: mongoose.Schema.Types.ObjectId[];
  following: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  resetToken: string;
  resetTokenExpiration: Date;
}

export interface CardType extends Document {
  name: string;
  price: number;
  image: string;
  collections: [];
  ifAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: mongoose.Schema.Types.ObjectId;
}

export interface CollectionType extends Document {
  name: string;
  author: string;
  description: string;
  logo: string;
  cover: string;
  backdrop: string;
  ifAvailable: boolean,
  cards: mongoose.Schema.Types.ObjectId[],
}

export interface RequestBodySignup {
  username: string;
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser; // Le type de user peut être ajusté en fonction de ce que vous stockez dans le JWT
}

export interface MyJwtPayload extends JwtPayload {
  user: string; // ou tout autre type approprié pour votre utilisateur
}

export interface DecodedUser extends JwtPayload {
  id: string; // Assurez-vous que cette propriété est correctement typée selon votre modèle d'utilisateur
  // Autres propriétés éventuelles
}

export interface UpdateEditUserType {
  username?: string;
  avatar?: string;
  email?: string;
  password?: string;
}

export interface UploadedFile {
  filename: string;
}