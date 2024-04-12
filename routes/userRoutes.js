import { Router } from "express";
import {
  getAllUsers,
  getSearchedUser,
  getUser,
  updateUser,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = Router();


router.get("/search", getSearchedUser);
router.get("/allUser", isAuthenticated ,getAllUsers);
router.get("/:id", isAuthenticated, getUser);
router.patch(
  "/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUser
);
// router.post("/upload", upload.single("profilePhoto"), uploadProfilePhoto);
export default router;
