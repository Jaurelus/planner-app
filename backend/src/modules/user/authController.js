import User from "./userModel.js";
import dotenv from "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const apiKey = process.env.TWILIO_API_KEY;
const sid = process.env.TWILIO_SID;
const sKey = process.env.MY_SECRET_KEY;

/* This function takes an accounts email adress as a paramter and sends a html message to validate */

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
    return res.status(400).json({ message: "Try catch failed" + error });
  }
};

export const loginUser = async (req, res) => {
  console.log("here");

  try {
    //Check if user login info is valid
    const { tbdUEmail, tdbUPW } = req.body;
    const intendedU = await User.findOne({ email: tbdUEmail });
    if (!intendedU) {
      return res.status(400).json({
        message:
          "This email doesn't match any email assoicated with any account in our records",
      });
    } else {
      if (await bcrypt.compare(tdbUPW, intendedU.password)) {
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
  try {
    const { id } = req.params;

    console.log(req.body);
    const {
      userFirst,
      userLast,
      userPassword,
      phone,
      userNotiToken,
      userNotisEnabled,
    } = req.body;
    console.log(phone);

    if (
      !userFirst &&
      !userLast &&
      !userPassword &&
      !phone &&
      !userNotiToken &&
      userNotisEnabled === undefined
    ) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    console.log("Exit");

    if (userPassword) {
      let newpassHash = bcrypt.hash(userPassword);
    }

    const currUser = await User.findById(id);
    console.log("Hi", currUser);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: userFirst || currUser.firstName,
        lastName: userLast || currUser.lastName,
        phoneNumber: phone || currUser.phoneNumber,
        pushToken: userNotiToken || currUser.pushToken,
        // Boolean, so `||` would swallow a deliberate false
        notificationsEnabled:
          userNotisEnabled === undefined
            ? currUser.notificationsEnabled
            : userNotisEnabled,
        password: newpassHash || currUser.password,
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

export const getUser = async (req, res) => {
  try {
    const { userid } = req.headers;
    const user = await User.findById(userid);
    return res
      .status(200)
      .json({ message: "Success getting user", user: user });
  } catch (error) {
    return res.status(400).json({ message: "Error " + error });
  }
};

export const logoutUser = async (req, res) => {
  return res.status(200).json({ message: "Success logging out" });
};

const refreshToken = async (req, res) => {};

const resetPW = async (req, res) => {};
