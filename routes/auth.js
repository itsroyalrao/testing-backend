import express from "express";
import {
  registerUser,
  getUser,
  isAuthorized,
  verifyUser,
} from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(getUser);
router.route("/").get(verifyUser, isAuthorized);

export default router;
