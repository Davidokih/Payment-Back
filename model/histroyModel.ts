import mongoose from "mongoose";

interface User {
  wallet: {};
  amount: number;
  sentTo?: string;
  receivedFrom?: string;
  paymentType?: string;
  transactionDescription?: string;
  MoneySentTo?: string;
  availableBalance?: number;
  transactionsReference: number;
}

interface iUser extends User, mongoose.Document {}

const historyModel = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallets",
    },

    amount: {
      type: Number,
    },

    availableBalance: {
      type: Number,
    },

    sentTo: {
      type: String,
    },

    transactionsReference: {
      type: Number,
    },

    paymentType: {
      type: String,
    },

    receivedFrom: {
      type: String,
    },

    transactionDescription: {
      type: String,
    },

    MoneySentTo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUser>("histories", historyModel);
