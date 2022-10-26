import mongoose from "mongoose";

interface User {
  user: {};
  history: {}[];
  totalBalance?: number;
  token?: number;
  credit?: number;
  debit?: number;
  amount?: number;
  paymentDescription?: string;
  fullName?: string;
}

interface iUser extends User, mongoose.Document {
  _id: string;
}

const walletModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "histories",
      },
    ],
    _id: {
      type: String,
    },
    totalBalance: {
      type: Number,
    },
    credit: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    debit: {
      type: Number,
    },
    token: {
      type: Number,
    },
    paymentDescription: {
      type: String,
    },
    fullName: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUser>("wallets", walletModel);
