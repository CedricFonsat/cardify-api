import { Request, Response } from "express";
import { Card } from "../models/card-model";
import mongoose, { Types } from "mongoose";
import { AuthenticatedRequest } from "../types/Interface";
import { User } from "../models/user-model";
import { ADMIN_ID } from "../../config";

export class cardController {
  static async getCards(req: Request, res: Response) {
    try {
      const cards = await Card.find();
      return res.status(200).json({ cards: cards });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async setUpdateCardById(req: Request, res: Response) {
    const { name, price } = req.body;
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });

      // s'assurer que l'on ne modifie pas la card alors qui il n'y a rien d'envoyer

      name && (card.name = req.body.name);
      price && (card.price = req.body.price);
      await card.save();

      return res.status(200).json({ message: "CARD_UPDATED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async setAddCard(req: Request, res: Response) {
    try {
      const card = new Card({
        name: req.body.name,
        price: req.body.price,
      });
      await card.save();
      return res.status(200).json({ message: "CARD_ADDED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async setDeleteCardById(req: Request, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
      await card.deleteOne();
      return res.status(200).json({ message: "CARD_DELETED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async setBuyCardById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });

      if (!req.user)
        return res.status(400).json({ message: "nothing user online" });
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(400).json({ message: "nothing User found" });
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(400).json({ message: "nothing card" });
      if (card.price > user.wallet)
        return res.status(400).json({ message: "your have don't money" });
      const wallet = user.wallet - card.price;
      const ADMIN = await User.findById(ADMIN_ID);
      if (!ADMIN) return res.status(400).json({ message: "nothing ADMIN" });
      const ADMIN_WALLET = ADMIN.wallet + card.price;

      // controller pour savoir si il y a deja
      // creer un global error pour factoriser le code

      await Card.findByIdAndUpdate(
        { _id: req.params.id },
        { ifAvailable: false, $push: { users: user } }
      );

      //$pull: {users: user},

      await User.findByIdAndUpdate(
        { _id: req.user.userId },
        { wallet: wallet, $push: { cards: req.params.id } }
      );

      await User.findByIdAndUpdate({ _id: ADMIN_ID }, { wallet: ADMIN_WALLET });

      return res.status(200).json({ message: "CARD_BUYED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async setSellCardById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });
      await Card.findByIdAndUpdate(
        { _id: req.params.id },
        { ifAvailable: true }
      );
      return res.status(200).json({ message: "CARD_SELLED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async setBuyUserCardById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });

      if (!req.user)
        return res.status(400).json({ message: "nothing user online" });

      const user = await User.findById(req.user.userId);
      if (!user) return res.status(400).json({ message: "nothing User found" });

      const card = await Card.findById(req.params.id);
      if (!card) return res.status(400).json({ message: "nothing card" });

      if (card.price > user.wallet)
        return res.status(400).json({ message: "your have don't money" });

      const userSellerId = card.users;
      const userSeller = await User.findById(userSellerId);
      if (!userSeller)
        return res.status(400).json({ message: "nothing user seller" });

      const wallet = user.wallet - card.price;
      const sellersCurrency = userSeller.wallet + card.price;

      await User.findByIdAndUpdate(
        { _id: req.user.userId },
        { wallet: wallet, $push: { cards: req.params.id } }
      );

      await User.findByIdAndUpdate(
        { _id: userSeller.id },
        { wallet: sellersCurrency, $pull: { cards: req.params.id } }
      );

      await Card.findByIdAndUpdate(
        {_id: req.params.id},
        {ifAvailable: false, $pull: {users: userSeller}, $push: {users: user}}
      )

      return res.status(200).json({ message: "CARD_BUYED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  }

  static async getSellersCards(req: AuthenticatedRequest, res: Response) {
    try {
      const cards = await Card.find({ifAvailable: true, users: { $exists: true, $not: { $size: 0 } } });
      if(!cards) return res.status(404).json({ error: "nothing card" });

      return res.status(200).json(cards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCardsByQueryAndFilters(req: AuthenticatedRequest, res: Response){
    try{
    
      const cards = await Card.find({ifAvailable: true, name: { $regex: req.params.query, $options: 'i' }});
      console.log(cards,'ggg');
      

      //add filters

      return res.status(200).json(cards);
    }catch(error){
      res.status(500).json({ message: "Internal server error e" });
    }
  }
}
