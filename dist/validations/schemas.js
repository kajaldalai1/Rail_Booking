"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = exports.loginSchema = exports.userSchema = void 0;
// src/validations/schemas.ts
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(50).required(),
    password: joi_1.default.string().min(6).max(100).required(),
    email: joi_1.default.string().email().required()
});
exports.loginSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(50).required(),
    password: joi_1.default.string().min(6).max(100).required()
});
exports.bookingSchema = joi_1.default.object({
    user_id: joi_1.default.number().integer().required(),
    train_id: joi_1.default.number().integer().required(),
    status: joi_1.default.string().valid('confirmed', 'pending', 'cancelled').required()
});
