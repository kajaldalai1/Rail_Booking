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
exports.getAvailableSeatsForTrain = void 0;
const db_1 = require("../db");
const getAvailableSeatsForTrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainId, classId } = req.params;
    try {
        const query = `
            SELECT total_seats - (
                SELECT COUNT(*)
                FROM tickets
                WHERE class_id = $1 AND train_id = $2
            ) AS available_seats
            FROM classes
            WHERE id = $1
        `;
        const result = yield db_1.pool.query(query, [classId, trainId]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error fetching available seats:', err);
        res.status(500).json({ error: err });
    }
});
exports.getAvailableSeatsForTrain = getAvailableSeatsForTrain;
