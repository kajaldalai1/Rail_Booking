import { Request, Response } from "express";
import { pool } from "../db";
import {
  bookTicketSchema,
  updateBookingSchema,
  cancelBookingSchema,
} from "../validations/schemas";

// Book a ticket
export const bookTicket = async (req: Request, res: Response) => {
  const { error } = bookTicketSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    userId,
    trainId,
    status,
    paymentMode,
    classId,
    journeyDate,
    ticketPrice,
  } = req.body;

  try {
    const query = `
      INSERT INTO bookings (user_id, train_id, status, payment_mode, class_id, journey_date, ticket_price, booking_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [
      userId,
      trainId,
      status,
      paymentMode,
      classId,
      journeyDate,
      ticketPrice,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error booking ticket:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a booking
export const updateBooking = async (req: Request, res: Response) => {
  const { error } = updateBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const bookingId = req.params.id;
  const { status, paymentMode, classId, journeyDate, ticketPrice } = req.body;

  try {
    const query = `
      UPDATE bookings
      SET status = $1, payment_mode = $2, class_id = $3, journey_date = $4, ticket_price = $5, booking_date = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;
    const values = [
      status,
      paymentMode,
      classId,
      journeyDate,
      ticketPrice,
      bookingId,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cancel a booking
export const cancelBooking = async (req: Request, res: Response) => {
  const { error } = cancelBookingSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const bookingId = req.params.id;

  try {
    const query =
      "UPDATE bookings SET status = $1, booking_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
    const values = ["cancelled", bookingId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking cancelled successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a particular user's booking
export const getUserBooking = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; // Assuming you have a middleware to set req.user

  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
