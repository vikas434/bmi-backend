import { Router } from "express";
import {
  sendOtp,
  verifyOtp,
  registerUser,
} from "../controllers/UserController.js";

const router = Router();

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.put("/:id", registerUser);

export default router;
