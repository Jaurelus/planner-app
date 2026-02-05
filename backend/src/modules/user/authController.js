import User from "./userModel.js";
import dotenv from "dotenv/config";

const apiKey = process.env.BREVO_API_KEY;

/* This function takes an accounts email adress as a paramter and sends a html message to validate */
const validateEmail = async (req, res) => {
  try {
    //How does this function
    const { userEmail, userPhoneNumber } = req.params;
    const verficationCode = Math.random().toString().slice(3, 9);
    if (!userPhoneNumber) {
      //Send email
    } else {
      //Send to number
    }
    //Send a randomized code
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { userEmail, userFirstName, userLastName } = req.params;
    const currUser = new User({
      email: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
    });
    //Await and save user into mongoose
    const savedUser = await currUser.save();
    return res
      .status(201)
      .json({ message: "User successfully added", User: savedUser });
    //return
  } catch (error) {
    return res.status(400).json({ message: error });
  }

  const loginUser = async (req, res) => {
    try {
      //Check if user login info is valid
      //If not retry the login
    } catch (error) {
      console.log(error);
    }
  };
};

const logOut = async (req, res) => {};

const refreshToken = async (req, res) => {};

const resetPW = async (req, res) => {};
