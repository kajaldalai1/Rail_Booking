"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/bookings.ts
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const bookingController_2 = require("../controllers/bookingController");
const bookingController_3 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.post('/', bookingController_1.bookTicket);
router.get('/pincode-wise-bookings-july', bookingController_2.getPincodeWiseBookingsForJuly);
router.get('/user-bookings/:userId', bookingController_2.getParticularUserBookingsAndVehicleDetails);
router.get('/state-wise-bookings', bookingController_2.getStateWiseBookingCounts);
router.get('/users-with-offline-payments', bookingController_2.getUsersWithOfflinePayments);
router.delete('/cancel-booking/:bookingId', bookingController_3.cancelBooking);
exports.default = router;
