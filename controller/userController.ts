import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken"
import { Response, Request } from "express";
import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth : {
      user : "davidyole023@gmail.com",
      pass: "pfacgjgkhzxkrmog"
  }
})

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find().sort({ createdAt: -1 });

    return res.status(200).json({ message: `all users`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findById(req.params.id);

    return res.status(200).json({ message: `single user`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, fullName } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { userName, fullName },
      { new: true }
    );

    return res.status(200).json({ message: `updated`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.findByIdAndRemove(req.params.id);

    return res.status(200).json({ message: `Delete` });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, fullName, email, password } = req.body;

    // const numb = crypto.randomBytes(4).toString("binary");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const data = await crypto.randomBytes(10).toString("hex")
    const token = await jwt.sign({data},"myTokenSecrete", {expiresIn: "1d"})

    const user = await userModel.create({
      userName,
      fullName,
      email,
      verifiedToken: token,
      isVerify: false,
      password: hash,
      accessToken: 100 + Math.floor(Math.random() * 1000),
    });
    
    const file = path.join(__dirname, "../views/index.ejs")

    ejs.renderFile(file,{
      id: user._id,
      verify: user.verifiedToken
    }, (err, data,) => {
      if (err) {
        console.log(err)
      } else {
        const mailOptions = {
          from: "my-Dev",
          to: email,
          subject: "Account verification",
          html: data
        }

        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err)
          } else {
            console.log("mail sent", info.response)
          }
        })
      }
    })

    return res.status(201).json({ message: `user Created`, data: user });
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const verifyUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await userModel.findById(req.params.id)

    if (user) {
      
      if (user.verifiedToken != "") {
        await userModel.findByIdAndUpdate(user._id, {
          verifiedToken: "",
          isVerify: true
        }, { new: true })
        
        return res.status(200).json({
          status: "Success",
          message: "User is now verified"
        })
      } else {
        return res.status(400).json({
          message: "You are not a user"
        })  
      }
    } else {
      return res.status(400).json({
        message: "You are not a user"
      })  
    }

  } catch (err) {
    return res.status(500).json({
      status: "Fail",
      message: err
    })
  }
}

export const signinUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });

    if (findUser) {
      if (findUser.isVerify === true) {
          const checkPassword = await bcrypt.compare(password, findUser.password);

        if (checkPassword) {
          const { ...info } = findUser._doc;

          return res
            .status(200)
            .json({ message: `welcome back ${findUser.fullName}`, data: info });
        } else {
          return res.status(404).json({ message: `password isn't correct` });
        }
      } else {
    const file = path.join(__dirname, "../views/index.ejs")

        ejs.renderFile(file,{
          id: findUser._id,
          verify: findUser.verifiedToken
        }, (err, data,) => {
          if (err) {
            console.log(err)
          } else {
            const mailOptions = {
              from: "my-Dev",
              to: email,
              subject: "Account verification",
              html: data
            }
    
            transport.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err)
              } else {
                return res.status(200).json({
                  message: `mail sente ${info.response}`
                })
                console.log("mail sent", info.response)
              }
            })
          }
        })

        return res.status(200).json({
          message: "Check your mail to verify"
        })
      }
    } else {
      return res.status(404).json({ message: `user doesn't exist` });
    }
  } catch (err) {
    return res.status(404).json({ message: `error ${err}` });
  }
};

export const newPassword = async (req: Request, res: Response) => {
  try {
    const {email} = req.body
    const user = await userModel.findOne({ email })
    
    if (user) {
      if (user.isVerify === true) {

      } else {
        return res.status(400).json({
          message: "User is not verified"
        })
      }
    } else {
      return res.status(400).json({
        message: "Invalid email"
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error
    })
  }
}


export const searchUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: "Successfull"
    })
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: error,
    })
  }
}