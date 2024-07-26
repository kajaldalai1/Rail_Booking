import { Request, Response } from "express";
import { pool } from "../db";

export const getAvailableSeatsForTrain = async (
  req: Request,
  res: Response
) => {
  const trainId = parseInt(req.params.trainId);
  const classNumber = req.params.classId;

  try {
    // Fetch total seats for the specified train and class
    const classQuery = `
      SELECT total_seats
      FROM classes
      WHERE train_id = $1 AND class_number = $2
    `;
    const classResult = await pool.query(classQuery, [trainId, classNumber]);

    if (classResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Class not found for this train" });
    }

    const totalSeats = classResult.rows[0].total_seats;

    // Fetch booked seats for the specified train and class
    const bookingQuery = `
      SELECT COUNT(*) AS booked_seats
      FROM bookings
      WHERE train_id = $1 AND class_number = $2 AND status = 'confirmed'
    `;
    const bookingResult = await pool.query(bookingQuery, [
      trainId,
      classNumber,
    ]);

    const bookedSeats = parseInt(bookingResult.rows[0].booked_seats, 10);
    const availableSeats = totalSeats - bookedSeats;

    res.json({ availableSeats });
  } catch (err) {
    console.error("Error fetching available seats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
