import { Router } from "express";
import { creatHistory, viewHistory } from "../controller/historyController";

const router = Router();

router.route("/:myID/:recieverID/create").patch(creatHistory);

router.route("/:myID/").get(viewHistory);

export default router;
