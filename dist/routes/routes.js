"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const routesController_1 = require("../controllers/routesController");
router.get('/routes/:trainId', routesController_1.getRoutesForTrain);
exports.default = router;
