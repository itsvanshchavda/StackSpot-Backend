import { Router } from "express";
import {
  deleteUser,
  getUser,
  updateUser,
  uploadProfilePhoto,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";

import upload from "../middleware/multer.js";
const router = Router();

router.delete("/:id", isAuthenticated, deleteUser);
router.get("/:id", isAuthenticated, getUser);

//Multer
router.post("/upload", upload.single("profilePhoto"), uploadProfilePhoto);

router.patch(
  "/:id",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUser
);

export default router;

