import mongoose from "mongoose";

interface User {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  verifiedToken: string;
  isVerify: boolean;
  accessToken: number;
  followers: {}[];
  following: {}[];
  wallet: {}[];
  _doc: {};
}

interface iUser extends User, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    verifiedToken: {
      type: String,
    },
    isVerify: {
      type: Boolean,
    },
    password: {
      type: String,
    },
    accessToken: {
      type: Number,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followers",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followings",
      },
    ],
    wallet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallets",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<iUser>("users", userModel);
