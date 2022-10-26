import { Router } from "express";
import { follow, unfollow } from "../controller/followerController";

const router = Router();

router.route("/:followingID/:followerID").patch(follow);

router.route("/:followingID/:followerID/delete").patch(unfollow);

export default router;
