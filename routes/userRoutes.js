import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSearchedUser,
  getUser,
  updateUser,
  uploadProfilePhoto,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/allUser", getAllUsers);
router.get("/search", getSearchedUser);
router.delete("/:id", isAuthenticated, deleteUser);
router.get("/:id", isAuthenticated, getUser);
router.patch(
  "/:id",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUser
);
router.post("/upload", upload.single("profilePhoto"), uploadProfilePhoto);
export default router;