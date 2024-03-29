import { Router } from "express";
import { deleteUser, getUser, updateUser, uploadProfilePhoto } from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = Router();

router.delete("/:id", isAuthenticated, deleteUser);
router.get("/:id", isAuthenticated, getUser);

//Multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./images");
  },

  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-profilephoto-${file.originalname}`;
    return cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('profilePhoto'), uploadProfilePhoto);

router.put("/:id", isAuthenticated, updateUser);

export default router;
