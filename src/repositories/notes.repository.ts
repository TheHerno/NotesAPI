import IRepository from "./repository";
import Note, { INote } from "../models/note";
import { IUser } from "../models/user";

export default class NotesRespository implements IRepository<INote> {
  public async getOne(id: string): Promise<INote | null> {
    const note = await Note.findById(id);
    return note;
  }

  public async getByUser(user: IUser): Promise<INote[]> {
    user = await user.populate("notes").execPopulate();
    return user.notes as INote[];
  }

  public async update(note: INote): Promise<INote> {
    note = await note.save();
    return note;
  }

  public async delete(note: INote, user: IUser): Promise<void> {
    user.deleteNote(note.id);
    await user.save();
    await Note.deleteOne(note);
  }

  public async save(note: INote, user: IUser): Promise<INote> {
    note = await note.save();
    user.addNote(note.getId());
    await user.save();
    return note;
  }

  public async getAll(): Promise<INote[]> {
    // no hay getAll
    return Promise.resolve([]);
  }
}
