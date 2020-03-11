import { IUser } from "../models/user";

declare namespace Express {
  interface User extends IUser {}
}

declare module "express-user";
