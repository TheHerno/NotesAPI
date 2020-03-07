import IRepository from "./repository";
import Note, { INote } from "../models/note";
import { IUser } from "../models/user";
import { Types } from "mongoose";

export default class NotesRespository implements IRepository<INote> {
  constructor() {}

  public async getOne(id: Types.ObjectId): Promise<INote | null> {
    const note = await Note.findById(id);
    return note;
  }

  public async getByUser(user: IUser): Promise<INote[]> {
    user = await user.populate("notes").execPopulate();
    console.log(user);
    return <INote[]>user.notes;
  }

  public async save(note: INote, user: IUser): Promise<INote> {
    note = await note.save();
    user.addNote(note.getId());
    await user.save();
    return note;
  }

  public async getAll(): Promise<INote[]> {
    //no hay getAll
    return Promise.resolve([]);
  }
}
