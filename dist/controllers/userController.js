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
exports.getUsers = void 0;
const db_1 = require("../db");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query to select users
        const result = yield db_1.pool.query('SELECT id, username, email FROM users');
        // Log result for debugging
        console.log("Fetched users:", result.rows);
        // Send response with users
        res.json(result.fields);
    }
    catch (err) {
        // Log the error for debugging
        console.error('Error fetching users:', err);
        // Send generic error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUsers = getUsers;
