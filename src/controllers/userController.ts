import { Request, Response } from "express";
import { pool } from "../db";
import { updateUserSchema } from "../validations/schemas";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT id, username, email FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  // Assuming you have a middleware to set req.user
  const userId = (req.user as { id: number }).id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  // Assuming you have a middleware to set req.user
  const userId = (req.user as { id: number }).id;
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    username,
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

  try {
    const query = `
      UPDATE users
      SET username = $1, email = $2, phone_number = $3, pincode = $4, street = $5, city = $6, country = $7, name = $8, age = $9, gender = $10, state = $11
      WHERE id = $12
      RETURNING *;
    `;
    const values = [
      username,
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
      userId,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response) => {
  // Assuming you have a middleware to set req.user
  const userId = (req.user as { id: number }).id;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User logout
export const userLogout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    res.status(200).send("Logged out successfully");
  });
};
