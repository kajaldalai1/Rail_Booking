import nodemailer from "nodemailer";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import {
  userSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/schemas";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req: Request, res: Response) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    username,
    password,
    email,
    phone_number,
    pincode,
    street,
    city,
    country,
    name,
    age,
    gender,
    state,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (username, password, email, phone_number, pincode, street, city, country, name, age, gender, state)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id;
  `;
  const values = [
    username,
    hashedPassword,
    email,
    phone_number,
    pincode,
    street,
    city,
    country,
    name,
    age,
    gender,
    state,
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = $1";
  const values = [username];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email } = req.body;

  const userQuery = "SELECT id, email FROM users WHERE email = $1";
  const userResult = await pool.query(userQuery, [email]);

  if (userResult.rows.length === 0) {
    return res.status(400).json({ error: "User does not exist" });
  }

  const user = userResult.rows[0];
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           http://${req.headers.host}/reset/${token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ error: "Error sending email" });
    }
    res.status(200).json({ message: "Password reset email sent" });
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatePasswordQuery = "UPDATE users SET password = $1 WHERE id = $2";
    await pool.query(updatePasswordQuery, [hashedPassword, userId]);

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
