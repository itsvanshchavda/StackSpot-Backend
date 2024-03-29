import { Router } from "express";
import { login, logout, refetch, register } from "../controller/auth.js";
import {isAuthenticated} from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refetch" , refetch);

export default router;
