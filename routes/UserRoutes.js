import { Router } from "express";
import { login } from "../controllers/UserController.js";

const router = Router();

router.post("/", login);

export default router;
