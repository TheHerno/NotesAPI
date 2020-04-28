import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default class UserController {
  constructor() {
    this.signIn = this.signIn.bind(this); //Fede's fix, signIn didn't recognize 'this' for some reason
  }

  private createToken(user: IUser) {
    return jwt.sign({ id: user._id, username: user.username }, config.jwtSecret, {
      expiresIn: 86400,
    });
  }

  public async signUp(req: Request, res: Response): Promise<Response> {
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).json({ error: "Please. Send your email, username and password" });
    }

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      user = await User.findOne({ username: req.body.username });

      if (user) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const newUser = new User(req.body);
      await newUser.save();
      newUser.password = "";
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async signIn(req: Request, res: Response): Promise<Response> {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and Password required" });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "User doesn't exists" });
      }

      const isMatch = await user.comparePassword(req.body.password);

      if (isMatch) {
        user.password = "";
        const token = this.createToken(user);
        return res.status(200).json({ user, token });
      }

      return res.status(400).json({ error: "Email or password incorrect" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
