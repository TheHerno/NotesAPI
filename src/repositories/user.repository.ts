import IRepository from "./repository";
import User, { IUser } from "../models/user";
import { Types } from "mongoose";

export default class UserRepository implements IRepository<IUser> {
  constructor() {}

  public async getOne(id: Types.ObjectId): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  public async findOne(u: Object): Promise<IUser | null> {
    const user = await User.findOne(u);
    return user;
  }

  public async getAll(): Promise<IUser[]> {
    const users = await User.find({});
    return users;
  }

  public async save(user: IUser): Promise<IUser> {
    user = await user.save();
    return user;
  }
}
