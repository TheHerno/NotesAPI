import { Types } from "mongoose";

export default interface IRepository<T> {
  getOne: (id: Types.ObjectId) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  save: (object: T, [...args]?: any) => Promise<T>;
}
