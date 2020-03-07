import { Router } from "express";
import passport from "passport";

const router = Router();

import { create, getByUser, getOne } from "../controllers/notes.controller";

router.post("/notes", passport.authenticate("jwt", { session: false }), create);
router.get("/notes", passport.authenticate("jwt", { session: false }), getByUser);
router.get("/notes/:id", passport.authenticate("jwt", { session: false }), getOne);

export default router;
