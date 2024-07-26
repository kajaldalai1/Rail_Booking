import express from "express";
const router = express.Router();
import { getRoutesForTrain } from "../controllers/routesController";

router.get("/trains/:trainId/routes", getRoutesForTrain);

export default router;
