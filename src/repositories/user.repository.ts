import IRepository from "./repository";
import User, { IUser } from "../models/user";

export default class UserRepository implements IRepository<IUser> {
  public async getOne(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  public async findOne(u: object): Promise<IUser | null> {
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
