import express from "express";
import { getAvailableSeatsForTrain } from "../controllers/classesController";
const router = express.Router();

router.get("/:trainId/classes/:classId/seats", getAvailableSeatsForTrain);

export default router;
