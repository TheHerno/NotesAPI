/// <reference types="express" />
import { IUser } from "../models/user";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}
