import { Router } from "express";
import {
  createUser,
  getUserMessages,
  getUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId/messages", getUserMessages);

export default router;
