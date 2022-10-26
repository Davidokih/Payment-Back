import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  signinUser,
} from "../controller/userController";

const router = Router();

router.route("/signin").post(signinUser);

router.route("/create").post(createUser);

router.route("/").get(getUsers);

router.route("/:id").get(getUser);

router.route("/:id/update").patch(updateUser);

router.route("/:id/delete").delete(deleteUser);

export default router;
