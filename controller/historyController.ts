import { Request, Response } from "express";
import mongoose from "mongoose";
import userModel from "../model/userModel";
import walletModel from "../model/walletModel";
import historyModel from "../model/histroyModel";

export const creatHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const time = Date.now() + Math.floor(Math.random() * Date.now());

    // reciever user
    const yourUser = await userModel.findById(req.params.recieverID);
    const yourWallet = await walletModel.findById(req.params.recieverID);

    // sender user
    const getUser = await userModel.findById(req.params.myID);
    const getWallet = await walletModel.findById(req.params.myID);

    //wallet

    if (getUser) {
      const viewHistory = await historyModel.create({
        amount: getWallet?.credit === 0 ? getWallet?.debit : getWallet?.credit,
        paymentType: getWallet?.credit === 0 ? "debit" : "credit",
        availableBalance: getWallet?.totalBalance,
        sentTo: yourUser?.fullName,
        transactionDescription: getWallet?.paymentDescription,
        MoneySentTo: getWallet?.fullName,
        transactionsReference: time,
      });

      getWallet?.history?.push(new mongoose.Types.ObjectId(viewHistory?._id));
      getWallet?.save();
    }

    if (yourUser) {
      const yourWallet = await walletModel.findById(req.params.recieverID);
      const viewHistory = await historyModel.create({
        amount:
          yourWallet?.debit === 0 ? yourWallet?.credit : yourWallet?.debit,
        paymentType: yourWallet?.debit === 0 ? "credit" : "debit",
        availableBalance: yourWallet?.totalBalance,
        receivedFrom: getUser?.fullName,
        transactionDescription: yourWallet?.paymentDescription,
        transactionsReference: time,
      });

      yourWallet?.history?.push(new mongoose.Types.ObjectId(viewHistory?._id));
      yourWallet?.save();
    }

    return res.status(201).json({ message: `History created` });
  } catch (error) {
    return res.status(404).json({ message: `error: ${error}` });
  }
};

export const viewHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const history = await walletModel
      .findById(req.params.myID)
      .populate({ path: "history", options: { sort: { createdAt: -1 } } });

    return res.status(201).json({ message: `viewing History `, data: history });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};
