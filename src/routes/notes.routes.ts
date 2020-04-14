import { Router } from "express";
import passport from "passport";

const router = Router();

import {
  create,
  getByUser,
  getOne,
  deleteOne,
  updateOne
} from "../controllers/notes.controller";

router.post("/notes", passport.authenticate("jwt", { session: false }), create);
router.get("/notes", passport.authenticate("jwt", { session: false }), getByUser);
router.get("/notes/:id", passport.authenticate("jwt", { session: false }), getOne);
router.delete("/notes/:id", passport.authenticate("jwt", { session: false }), deleteOne);
router.put("/notes/:id", passport.authenticate("jwt", { session: false }), updateOne);

export default router;
