import User from "./userModel.js";
import dotenv from "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const apiKey = process.env.TWILIO_API_KEY;
const sid = process.env.TWILIO_SID;
const sKey = process.env.MY_SECRET_KEY;

import twilio from "twilio";
const client = twilio(sid, apiKey);

/* This function takes an accounts email adress as a paramter and sends a html message to validate */
export const sendVerification = async (req, res) => {
  try {
    const { userEmail, userPhoneNumber } = req.body;
    const verficationCode = Math.random().toString().slice(3, 9);
    if (!userPhoneNumber) {
      //Send email
      return res.status(200).json({ message: "Email sent" });
    } else {
      //Send to number
      const vMessage = client.verify.v2
        .services("VA3e65986353629354e3899002ab05605e")
        .verifications.create({
          to: userPhoneNumber.padStart(12, "+1"),
          channel: "sms",
        });
      return res.status(200).json({ message: "Message sent" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const validateUser = async (req, res) => {
  try {
    const { uCode, email, number } = req.body;
    const { id } = req.params;
    if (number) {
      const verStat = await client.verify.v2
        .services("VA3e65986353629354e3899002ab05605e")
        .verificationChecks.create({
          code: uCode,
          to: number.padStart(12, "+1"),
        });

      if (verStat.status == "approved") {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { isVerified: true },
          { new: true },
        );
        //login
        return res
          .status(200)
          .json({ message: "User verified", user: updatedUser });
      } else return res.status(401).json({ message: "Incorrect code" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error back " + error });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { userEmail, userPW } = req.body;
    if (!userEmail) {
      return res.status(400).json({ message: "No username" });
    }
    if (!userPW) {
      return res.status(400).json({ message: "No password" });
    }

    const currUser = new User({
      email: userEmail,
      password: await bcrypt.hash(userPW, 10),
    });
    //Await and save user into mongoose
    const savedUser = await currUser.save();
    return res
      .status(201)
      .json({ message: "User successfully added", user: savedUser });
    //return
  } catch (error) {
    return res.status(400).json({ message: "Try catch failed" });
  }
};

export const loginUser = async (req, res) => {
  console.log("here");

  try {
    //Check if user login info is valid
    const { tbdUEmail, tdbUPW } = req.body;
    const intendedU = await User.findOne({ email: tbdUEmail });
    console.log("Intended User", intendedU);
    if (!intendedU) {
      return res.status(400).json({
        message:
          "This email doesn't match any email assoicated with any account in our records",
      });
    } else {
      if (await bcrypt.compare(tdbUPW, intendedU.password)) {
        console.log("Compare passed");
        const id = intendedU._id;
        //login user

        let token = jwt.sign({ email: tbdUEmail }, sKey, { expiresIn: "7d" });
        return res.status(200).json({
          message: "User sucessfully logged in",
          user: intendedU,
          token: token,
        });
      } else
        return res.status(400).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

//Function to update uesr info
export const editUser = async (req, res) => {
  const payload = {};
  try {
    const { id } = req.params;

    console.log(req.body);
    const { userFirst, userLast, userPassword, phone } = req.body;
    console.log(phone);

    if (!userFirst && !userLast && !userPassword && !phone) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    console.log("Exit");

    if (userPassword) {
      payload.password = bcrypt.hash(userPassword);
    } else if (userFirst) {
      payload.firstName = userFirst;
    } else if (userLast) {
      payload.lastName = userLast;
    } else if (phone) {
      payload.phoneNumber = phone;
      console.log("Selected");
    }

    const currUser = await User.findById(id);
    console.log("Hi", currUser);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: userFirst || currUser.firstName,
        lastName: userLast || currUser.lastName,
        phoneNumber: phone || currUser.phoneNumber,
      },
      { new: true },
    );
    console.log("Update", updatedUser);
    if (!currUser) return res.status(400).json("User not found");
    return res
      .status(200)
      .json({ message: "User info succesfully updated.", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: "Problem" });
  }
};

const logOut = async (req, res) => {};

const refreshToken = async (req, res) => {};

const resetPW = async (req, res) => {};
