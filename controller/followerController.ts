import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import followerModel from "../model/followers";
import followingModel from "../model/followingModel";
import { Response, Request } from "express";

export const follow = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await userModel.findByIdAndUpdate(
      req.params.followingID,
      {
        $push: { following: req.params.followerID },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.params.followerID,
      {
        $push: { followers: req.params.followingID },
      },
      { new: true }
    );

    return res.status(200).json({ message: `starting following: ` });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};

export const unfollow = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await userModel.findByIdAndUpdate(
      req.params.followingID,
      {
        $pull: { following: req.params.followerID },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.params.followerID,
      {
        $pull: { followers: req.params.followingID },
      },
      { new: true }
    );
    return res.status(200).json({ message: `stop following: ` });
  } catch (err) {
    return res.status(404).json({ message: `error: ${err}` });
  }
};
