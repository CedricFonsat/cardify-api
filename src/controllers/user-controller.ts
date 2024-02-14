import { User } from "./../models/user-model";
import { AuthenticatedRequest, UserType } from "../types/Interface";
import { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import { ObjectId } from "mongoose";

export class userController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "error", error: error });
    }
  }

  static async setEditUserById(req: AuthenticatedRequest, res: Response) {
    try{
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });

      const user = await User.findOne({ _id: req.params.id });
      if (!user)
        return res.status(404).json({ message: "User not found" });

        await User.findOneAndUpdate(
          { _id: req.params.id },
          {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              // avatar: req.body.avatar
          }
      );
      
      return res.status(200).json({ message: 'USER_UPDATED'});

    }catch (error) {
      return res.status(500).json({ message: "error", error: error });
    }
  }

  static async setDeleteUserById(req: AuthenticatedRequest, res: Response) {
    try{
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });

      const user = await User.findOne({ _id: req.params.id });
      if (!user)
        return res.status(404).json({ message: "User not found" });

      await User.findOneAndDelete({ _id: req.params.id });

      return res.status(200).json({ message: 'USER_DELETED'});

    }catch (error) {
      return res.status(500).json({ message: "error", error: error });
    }
  }

  static async getUserMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user)
        return res.status(401).json({ message: "INVALID_USERNAME" });
      const userId = req.user.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (e) {
      res.status(500).json({ message: "Error in Fetching user" }); // Gérer l'erreur ici
    }
  }

  static async setFollow(req: AuthenticatedRequest, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });
      if (!req.user)
        return res.status(401).json({ message: "INVALID_USERNAME" });
      if (req.user.userId === req.params.id)
        return res.status(400).json({ error: "You cannot follow yourself" });

      // verifier si le user n'est pas deja abonné

      const userConnected = await User.findById(req.user.userId);
      const userFollowing = await User.findById(req.params.id);

      if (!userConnected)
        return res.status(404).json({ error: "User not found" });
      if (!userFollowing)
        return res.status(404).json({ error: "User not found" });

      await User.findOneAndUpdate(
        { _id: req.user.userId },
        { $push: { following: userFollowing._id } }
      );
      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { followers: userConnected._id } }
      );

      return res.status(200).json({ message: "User followed" });
    } catch (e) {
      res.status(500).json({ message: "Error in Fetching user" });
    }
  }

  static async setUnfollow(req: AuthenticatedRequest, res: Response) {
    try {
      if (!mongoose.mongo.ObjectId.isValid(req.params.id))
        return res.status(404).json({ error: "Invalid ID" });
      if (!req.user)
        return res.status(401).json({ message: "INVALID_USERNAME" });
      if (req.user.userId === req.params.id)
        return res.status(400).json({ error: "You cannot follow yourself" });

      // verifier si le user n'est pas deja abonné

      const userConnected = await User.findById(req.user.userId);
      const userFollowing = await User.findById(req.params.id);

      if (!userConnected)
        return res.status(404).json({ error: "User not found" });
      if (!userFollowing)
        return res.status(404).json({ error: "User not found" });

      await User.findOneAndUpdate(
        { _id: req.user.userId },
        { $pull: { following: userFollowing._id } }
      );
      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { followers: userConnected._id } }
      );

      return res.status(200).json({ message: "User unfollowed" });
    } catch (e) {
      res.status(500).json({ message: "Error in Fetching user" });
    }
}

  static async getFollowingsMe(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: "INVALID_USERNAME" });

    const user = await User.findById(req.user.userId);

    if (user) {
      User.find({ _id: { $in: user.following } })
        .then((followedUsers) => {
          if (followedUsers.length !== 0) {
            followedUsers.forEach((followings) => {
              console.log(followings);
              return res.status(200).json(followings);
            });
          }
          return res.status(200).json([]);
        })
        .catch((error) => {
          console.error("Error fetching followed users:", error);
        });
    }
  }

  static async getFollowersMe(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: "INVALID_USERNAME" });

    const user = await User.findById(req.user.userId);

    if (user) {
      User.find({ _id: { $in: user.followers } })
        .then((followedUsers) => {
          if (followedUsers.length !== 0) {
            followedUsers.forEach((followers) => {
              return res.status(200).json(followers);
            });
          }
          return res.status(200).json([]);
        })
        .catch((error) => {
          console.error("Error fetching followed users:", error);
        });
    }
  }

  static async getFollowingsById(req: AuthenticatedRequest, res: Response) {
    if (!req.params) return res.status(401).json({ message: "INVALID_USERNAME" });

    const user = await User.findById(req.params.id);

    if (user) {
      User.find({ _id: { $in: user.following } })
        .then((followedUsers) => {
          if (followedUsers.length !== 0) {
            followedUsers.forEach((followings) => {
              return res.status(200).json(followings);
            });
          }
          return res.status(200).json([]);
        })
        .catch((error) => {
          console.error("Error fetching followed users:", error);
        });
    }
  }

  static async getFollowersById(req: AuthenticatedRequest, res: Response) {
    if (!req.params) return res.status(401).json({ message: "INVALID_USERNAME" });

    const user = await User.findById(req.params.id);

    if (user) {
      User.find({ _id: { $in: user.followers } })
        .then((followedUsers) => {
          if (followedUsers.length !== 0) {
            followedUsers.forEach((followers) => {
              return res.status(200).json(followers);
            });
          }
          return res.status(200).json([]);
        })
        .catch((error) => {
          console.error("Error fetching followed users:", error);
        });
    }
  }
}
