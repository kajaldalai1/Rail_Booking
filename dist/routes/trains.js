"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/trains.ts
const express_1 = __importDefault(require("express"));
const trainController_1 = require("../controllers/trainController");
const trainController_2 = require("../controllers/trainController");
const router = express_1.default.Router();
router.get('/', trainController_1.getTrains);
router.get('/trains/:trainId', trainController_2.getTrainDetails);
exports.default = router;
