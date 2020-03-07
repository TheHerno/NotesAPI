import { Request, Response } from "express";
import NotesRepository from "../repositories/notes.repository";
import Note from "../models/note";
import UserRepository from "../repositories/user.repository";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response): Promise<Response> => {
  const notesRepo: NotesRepository = new NotesRepository();
  const userRepo: UserRepository = new UserRepository();

  if (!req.body.title || !req.body.content || !req.user) {
    return res.status(400).json({ error: "Please send title and content, and be logged in" });
  }

  let note = new Note(req.body);

  const user = await userRepo.getOne(req.user.id);

  if (!user) {
    return res.status(400).json({ error: "Error getting that user" });
  }
  note = await notesRepo.save(note, user);

  return res.status(201).json(note);
};

export const getByUser = async (req: Request, res: Response): Promise<Response> => {
  const notesRepo: NotesRepository = new NotesRepository();
  const userRepo: UserRepository = new UserRepository();
  if (!req.user) {
    return res.status(400).json({ error: "Please be logged in" });
  }
  const user = await userRepo.getOne(req.user.id);
  if (!user) {
    return res.status(400).json({ error: "Please be logged in" });
  }
  const notes = await notesRepo.getByUser(user);
  return res.status(201).json(notes);
};

export const getOne = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user || !req.params.id) {
    return res.status(400).json({ error: "Please be logged in and send id" });
  }
  const userRepo: UserRepository = new UserRepository();
  const user = await userRepo.findOne(req.user);

  if (!user || !user.containsNote(req.params.id)) {
    return res.status(400).json({ error: "That note is not yours." });
  }

  const notesRepo: NotesRepository = new NotesRepository();

  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(400).json({ error: "That note doesn't exist." });
  }

  return res.status(200).json(note);
};
