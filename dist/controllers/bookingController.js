"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getUsersWithOfflinePayments = exports.getStateWiseBookingCounts = exports.getParticularUserBookingsAndVehicleDetails = exports.getPincodeWiseBookingsForJuly = exports.bookTicket = void 0;
const db_1 = require("../db");
const schemas_1 = require("../validations/schemas");
const bookTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = schemas_1.bookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { user_id, train_id, status } = req.body;
    //   console.log("1232",req.body);
    try {
        // Check if the train exists
        const trainQuery = `SELECT train_id FROM trains where train_id = ${train_id}`;
        // const value = [train_id];
        const trainResult = yield db_1.pool.query(trainQuery);
        console.log("trains", trainResult.rows);
        if (trainResult.rows.length === 0) {
            return res.status(400).json({ error: 'Train does not exist' });
        }
        // Insert the booking
        const bookingQuery = `
      INSERT INTO bookings (user_id, train_id, status)
      VALUES ($1, $2, $3) RETURNING id, booking_time
    `;
        const values = [user_id, train_id, status];
        const result = yield db_1.pool.query(bookingQuery, values);
        console.log(result);
        res.status(201).json({
            bookingId: result.rows[0].id,
            bookingTime: result.rows[0].booking_time
        });
    }
    catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.bookTicket = bookTicket;
// Pincode-wise User Bookings for July
const getPincodeWiseBookingsForJuly = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
        SELECT 
            u.pincode, 
            COUNT(b.id) AS booking_count
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE DATE_TRUNC('month', b.booking_time) = '2024-07-01'
        GROUP BY u.pincode;
      `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching pincode-wise bookings:', err);
        res.status(500).json({ error: err });
    }
});
exports.getPincodeWiseBookingsForJuly = getPincodeWiseBookingsForJuly;
const getParticularUserBookingsAndVehicleDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const result = yield db_1.pool.query(`
        SELECT 
            b.id AS booking_id,
            b.booking_time,
            t.train_name,
            t.train_id,
            v.vehicle_name,
            v.vehicle_number
        FROM bookings b
        JOIN trains t ON b.train_id = t.train_id
        LEFT JOIN vehicles v ON b.id = v.booking_id
        WHERE b.user_id = $1;
      `, [userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching user bookings and vehicle details:', err);
        res.status(500).json({ error: err });
    }
});
exports.getParticularUserBookingsAndVehicleDetails = getParticularUserBookingsAndVehicleDetails;
const getStateWiseBookingCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
        SELECT 
            u.state, 
            COUNT(b.id) AS booking_count
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        GROUP BY u.state
        ORDER BY booking_count DESC;
      `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching state-wise booking counts:', err);
        res.status(500).json({ error: err });
    }
});
exports.getStateWiseBookingCounts = getStateWiseBookingCounts;
const getUsersWithOfflinePayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`
        SELECT 
            u.id AS user_id, 
            u.username, 
            u.email, 
            u.pincode, 
            u.state
        FROM users u
        JOIN bookings b ON u.id = b.user_id
        JOIN payments p ON b.id = p.booking_id
        WHERE p.payment_method = 'Offline';
      `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching users with offline payments:', err);
        res.status(500).json({ error: err });
    }
});
exports.getUsersWithOfflinePayments = getUsersWithOfflinePayments;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    try {
        yield db_1.pool.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
        res.json({ message: 'Booking cancelled successfully' });
    }
    catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: err });
    }
});
exports.cancelBooking = cancelBooking;
