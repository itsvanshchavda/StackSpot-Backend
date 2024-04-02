import { Router } from "express";
import {
  addBookmark,
  deletePost,
  getAllPost,
  getPost,
  getSearchedPost,
  likePost,
  removeBookmark,
  unlikePost,
  updatePost,
  uploadImage,
  userPost,
  writePost,
} from "../controller/post.js";
import { isAuthenticated } from "../middleware/auth.js";

import multer from "multer";

const router = Router();

router.get("/search", getSearchedPost);
router.get("/:id", getPost);
router.get("/", getAllPost);
router.get("/user/:userID", userPost);
router.post("/create", isAuthenticated, writePost);
router.put("/:id", isAuthenticated, updatePost);
router.delete("/:id", isAuthenticated, deletePost);

router.put("/like/:id", isAuthenticated, likePost);
router.put("/unlike/:id", isAuthenticated, unlikePost);

router.put('/addbookmark/:id', isAuthenticated, addBookmark);
router.put('/removebookmark/:id', isAuthenticated, removeBookmark);


//Image Upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./images");
  },

  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    return cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadImage);

export default router;
