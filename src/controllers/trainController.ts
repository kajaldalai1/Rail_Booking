import { Request, Response } from "express";
import { pool } from "../db";

// Get all trains
export const getTrains = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM trains");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching trains:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTrainDetails = async (req: Request, res: Response) => {
  const trainId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM trains WHERE id = $1", [
      trainId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Train not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching train details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
