"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coachesController_1 = require("../controllers/coachesController");
const router = express_1.default.Router();
router.get('/:trainId/coaches', coachesController_1.getCoachesForTrain);
exports.default = router;
