// src/routes/trains.ts
import express from "express";
import { getTrains, getTrainDetails } from "../controllers/trainController";

const router = express.Router();

router.get("/", getTrains);
router.get("/details/:id", getTrainDetails);

export default router;
