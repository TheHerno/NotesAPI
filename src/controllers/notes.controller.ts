import { Request, Response } from "express";
import Note from "../models/note";
import { IUser } from "../models/user";

export default class NotesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.title || !req.body.content) {
        return res
          .status(400)
          .json({ error: "Please send title and content, and be logged in" });
      }

      let note = new Note(req.body);

      note.author = (req.user as IUser)._id;

      note = await note.save();

      return res.status(201).json(note);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async getByUser(req: Request, res: Response): Promise<Response> {
    try {
      const notes = await Note.find({ author: (req.user as IUser)._id })
        .lean()
        .exec();

      return res.status(201).json(notes);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  public async getOne(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.params.id) {
        return res.status(403).json({ error: "Please send id" });
      }

      const note = await Note.findOne({ _id: req.params.id });

      if (!note) {
        return res.status(400).json({ error: "That note doesn't exist." });
      }

      if ((req.user as IUser)._id.toString() !== note.author.toString()) {
        return res.status(403).json({ error: "That note is not yours." });
      }

      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async deleteOne(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.params.id) {
        return res.status(403).json({ error: "Please send id." });
      }

      const note = await Note.findOne({ _id: req.params.id });

      if (!note) {
        return res.status(404).json({ error: "That note doesn't exist." });
      }
      if ((req.user as IUser)._id + "" !== note.author + "") {
        return res.status(403).json({ error: "That note is not yours." });
      }

      await Note.deleteOne(note);
      return res.status(200).json({ success: "Note deleted." });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async updateOne(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.params.id) {
        return res.status(403).json({ error: "Please send id." });
      }
      if (!req.body.title || !req.body.content) {
        return res.status(400).json({ error: "Please send title and content." });
      }

      const note = await Note.findOne({ _id: req.params.id });

      if (!note) {
        return res.status(404).json({ error: "That note doesn't exist." });
      }

      if ((req.user as IUser)._id.toString() !== note.author.toString()) {
        return res.status(403).json({ error: "That note is not yours." });
      }

      note.title = req.body.title;
      note.content = req.body.content;
      await note.save();
      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
