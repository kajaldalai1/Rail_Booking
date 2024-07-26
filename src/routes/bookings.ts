import express from "express";
import {
  bookTicket,
  updateBooking,
  cancelBooking,
  getUserBooking,
} from "../controllers/bookingController";

const router = express.Router();

router.post("/book", bookTicket);
router.put("/update/:id", updateBooking);
router.put("/cancel/:id", cancelBooking);
router.get("/view", getUserBooking);

export default router;
