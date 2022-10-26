import { Router } from "express";
import {
  createWallet,
  viewWallet,
  updateWallet,
} from "../controller/walletController";

const router = Router();

router.route("/:id/create").post(createWallet);

router.route("/:id/wallet").get(viewWallet);

router.route("/:myID/:recieverID/send").patch(updateWallet);

export default router;
