import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import UserRepository from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import config from "../config/config";

const userRepo: UserRepository = new UserRepository();

function createToken(user: IUser) {
  return jwt.sign({ id: user.getId(), email: user.getEmail() }, config.jwtSecret, {
    expiresIn: 86400,
  });
}

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(400).json({ error: "Please. Send your email, username and password" });
  }

  try {
    let user = await userRepo.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    user = await userRepo.findOne({ username: req.body.username });

    if (user) {
      return res.status(400).json({ error: "Username already taken" });
    }

    let newUser = new User(req.body);
    newUser = await userRepo.save(newUser);
    newUser.setPassword("");
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and Password required" });
  }
  try {
    const user = await userRepo.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "User doesn't exists" });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      user.password = "";
      return res.status(200).json({ user, token: createToken(user) });
    }

    return res.status(400).json({ error: "Email or password incorrect" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
