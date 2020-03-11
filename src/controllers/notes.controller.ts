import { Request, Response } from "express";
import NotesRepository from "../repositories/notes.repository";
import Note from "../models/note";
import UserRepository from "../repositories/user.repository";

export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const notesRepo: NotesRepository = new NotesRepository();
    const userRepo: UserRepository = new UserRepository();

    if (!req.body.title || !req.body.content || !req.user) {
      return res
        .status(400)
        .json({ error: "Please send title and content, and be logged in" });
    }

    let note = new Note(req.body);

    const user = await userRepo.getOne(req.user.id);

    if (!user) {
      return res.status(400).json({ error: "Error getting that user" });
    }
    note = await notesRepo.save(note, user);

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const notesRepo: NotesRepository = new NotesRepository();
    const userRepo: UserRepository = new UserRepository();
    if (!req.user) {
      return res.status(403).json({ error: "Please be logged in" });
    }
    const user = await userRepo.getOne(req.user.id);
    if (!user) {
      return res.status(403).json({ error: "Please be logged in" });
    }
    const notes = await notesRepo.getByUser(user);
    return res.status(201).json(notes);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.params.id) {
      return res.status(403).json({ error: "Please be logged in and send id" });
    }
    const userRepo: UserRepository = new UserRepository();
    const user = await userRepo.findOne(req.user);

    if (!user || !user.containsNote(req.params.id)) {
      return res.status(400).json({ error: "That note is not yours." });
    }

    const notesRepo: NotesRepository = new NotesRepository();

    const note = await notesRepo.getOne(req.params.id);

    if (!note) {
      return res.status(400).json({ error: "That note doesn't exist." });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.params.id) {
      return res.status(403).json({ error: "Please be logged in and send id." });
    }
    const notesRepo: NotesRepository = new NotesRepository();
    const userRepo: UserRepository = new UserRepository();
    const user = await userRepo.getOne(req.user.id);
    if (!user) {
      return res.status(403).json({ error: "Something weird happened." });
    }
    const note = await notesRepo.getOne(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "That note doesn't exist." });
    }

    await notesRepo.delete(note, user);
    return res.status(200).json({ success: "Note deleted." });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateOne = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.params.id) {
      return res.status(403).json({ error: "Please be logged in and send id." });
    }
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: "Please send title and content." });
    }
    const notesRepo: NotesRepository = new NotesRepository();
    const userRepo: UserRepository = new UserRepository();
    const user = await userRepo.getOne(req.user.id);
    if (!user) {
      return res.status(403).json({ error: "Something weird happened." });
    }
    const note = await notesRepo.getOne(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "That note doesn't exist." });
    }

    if (!user.containsNote(note.id)) {
      return res.status(403).json({ error: "That note's not yours." });
    }
    note.title = req.body.title;
    note.content = req.body.content;
    await notesRepo.update(note);
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json(error);
  }
};
