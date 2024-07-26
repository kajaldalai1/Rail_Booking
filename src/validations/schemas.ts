import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  pincode: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().required(),
  state: Joi.string().required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  pincode: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().required(),
  state: Joi.string().required(),
});

export const bookTicketSchema = Joi.object({
  userId: Joi.number().required(),
  trainId: Joi.number().required(),
  status: Joi.string().valid("confirmed", "pending", "cancelled").required(),
  paymentMode: Joi.string().valid("online", "offline").required(),
  classId: Joi.number().required(),
  journeyDate: Joi.date().required(),
  ticketPrice: Joi.number().required(),
});

export const updateBookingSchema = Joi.object({
  status: Joi.string().valid("confirmed", "pending", "cancelled").required(),
  paymentMode: Joi.string().valid("online", "offline").optional(),
  classId: Joi.number().optional(),
  journeyDate: Joi.date().optional(),
  ticketPrice: Joi.number().required(),
});

export const cancelBookingSchema = Joi.object({
  bookingId: Joi.number().required(),
});

export const trainSchema = Joi.object({
  trainName: Joi.string().max(100).required(),
  source: Joi.string().max(100).required(),
  destination: Joi.string().max(100).required(),
  trainDepartureTime: Joi.date().required(),
  trainArrivalTime: Joi.date().required(),
});
