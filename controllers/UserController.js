import otpGenerator from "otp-generator";
import userModel from "../models/UserModel.js";
import twilio from "twilio";

const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER";

const client = twilio(accountSid, authToken);

export const login = async (req, res) => {
  try {
    const { number } = req.body;
    const user = await userModel.findOne({ phoneNumber: number });
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    if (user) {
      user.otp = otp;
      user.optExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();

      // Send the OTP via SMS using Twilio
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: number,
      });

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      const newUser = await userModel.create({ phoneNumber: number });
      newUser;
      res.status(200).json({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const otpVerification = async (req, res) => {
  try {
    const { number, otp } = req.body;
    const user = await userModel.findOne({
      phoneNumber: number,
      otp: otp,
      optExpiry: { $gt: Date.now() },
    });

    if (user) {
      user.otp = undefined;
      user.optExpiry = undefined;
      user.isRegistered = true;
      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
