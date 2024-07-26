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
exports.getTrainDetails = exports.getTrains = void 0;
const db_1 = require("../db");
const console_1 = require("console");
const getTrains = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM trains';
    try {
        const result = yield db_1.pool.query(query);
        res.json(result.fields);
    }
    catch (err) {
        console.error('Error fetching trains:', err);
        res.status(500).json({ error: console_1.error });
    }
});
exports.getTrains = getTrains;
const getTrainDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainId } = req.params;
    try {
        const result = yield db_1.pool.query('SELECT * FROM trains WHERE train_id = $1', [trainId]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error fetching train details:', err);
        res.status(500).json({ error: err });
    }
});
exports.getTrainDetails = getTrainDetails;
