"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classesController_1 = require("../controllers/classesController");
const router = express_1.default.Router();
router.get('/:trainId/classes/:classId/available-seats', classesController_1.getAvailableSeatsForTrain);
exports.default = router;
