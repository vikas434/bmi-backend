import otpGenerator from "otp-generator";
import twilio from "twilio";
import OtpModel from "../models/OtpModel.js";
import UserModel from "../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendOtp = async (req, res) => {
  try {
    const { number } = req.body;
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: number,
    });

    const otpVerify = await OtpModel.create({
      phoneNumber: number,
      otp: otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await otpVerify.save();
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong", status: "bad" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;
    console.log(req.body);
    const otpVerify = await OtpModel.findOne({
      phoneNumber: number,
      otp: otp,
    });

    if (otpVerify.otpExpiry < Date.now())
      return res.status(500).json({ status: "bad", message: "Otp expired" });

    if (otpVerify.otp != otp)
      return res.status(500).json({ status: "bad", message: "Wrong Otp" });

    await OtpModel.findByIdAndDelete(otpVerify._id);

    const user = await UserModel.findOne({ phoneNumber: number });

    if (user) {
      res.status(200).json({ status: "ok", user: user });
    } else {
      const newUser = await UserModel.create({ phoneNumber: number });
      await newUser.save();
      res.status(201).json({ status: "ok", user: newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "bad", error: "Something went wrong" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender } = req.body;

    const user = await UserModel.findById(id);
    if (!user)
      return res.status(400).json({ status: "bad", message: "No user found" });

    user.name = name;
    user.age = age;
    user.gender = gender;
    user.isRegisterd = true;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ status: "bad", error: error.message });
  }
};
