import userModel from "../model/userModel";
import walletModel from "../model/walletModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // const { totalBalance, token, credit, debit, paymentDescription } = req.body;

    const getUser = await userModel.findById(req.params.id);

    const getWallet = await walletModel.create({
      _id: getUser?._id!,
      totalBalance: 1000,
      credit: 0,
      debit: 0,
      token: getUser?.accessToken,
      paymentDescription: "",
    });

    getUser?.wallet.push(new mongoose.Types.ObjectId(getWallet._id));
    getUser?.save();

    return res
      .status(201)
      .json({ message: `wallet created `, data: getWallet });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};

export const viewWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { totalBalance, token, credit, debit, paymentDescription } = req.body;

    const wallet = await userModel.findById(req.params.id).populate({
      path: "wallet",
      options: { sort: { createdAt: -1 } },
    });

    return res.status(201).json({ message: `wallet created `, data: wallet });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};

export const updateWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { amount, token, paymentDescription } = req.body;

    // const { totalBalance, token, credit, debit, paymentDescription } = req.body;

    const user = await userModel.findById(req.params.myID);
    const myWallet = await walletModel.findById(req.params.myID);

    const yourWallet = await walletModel.findById(req.params.recieverID);

    if (user?.accessToken === token) {
      if (myWallet?.totalBalance! > amount && myWallet?.totalBalance! > 0) {
        await walletModel.findByIdAndUpdate(
          req.params.myID,
          {
            totalBalance: myWallet?.totalBalance! - amount,
            debit: amount,
            credit: 0,
            paymentDescription,
          },
          { new: true }
        );

        await walletModel.findByIdAndUpdate(
          req.params.recieverID,
          {
            totalBalance: yourWallet?.totalBalance! + amount,
            credit: amount,
            debit: 0,
            paymentDescription,
            fullName: user?.fullName,
          },
          { new: true }
        );
      } else {
        return res.status(404).json({ message: `insufficiant fund` });
      }
    } else {
      return res
        .status(404)
        .json({ message: `Your entered token ${token} isn't correct` });
    }

    return res
      .status(201)
      .json({ message: `Transfer of ₦${amount} was successful ` });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};
