import { Router } from "express";
import UserController from "./../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

export default router;
