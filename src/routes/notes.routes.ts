import { Router } from "express";
import NotesController from "../controllers/notes.controller";
import passport from "passport";

const router = Router();
const notesController = new NotesController();

router.post(
  "/notes",
  passport.authenticate("jwt", { session: false }),
  notesController.create
);
router.get(
  "/notes",
  passport.authenticate("jwt", { session: false }),
  notesController.getByUser
);
router.get(
  "/notes/:id",
  passport.authenticate("jwt", { session: false }),
  notesController.getOne
);
router.delete(
  "/notes/:id",
  passport.authenticate("jwt", { session: false }),
  notesController.deleteOne
);
router.put(
  "/notes/:id",
  passport.authenticate("jwt", { session: false }),
  notesController.updateOne
);

export default router;
