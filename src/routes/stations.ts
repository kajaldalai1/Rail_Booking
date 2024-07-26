import express from "express";
const router = express.Router();
import { getAllStations } from "../controllers/stationController";

router.get("/", getAllStations);
export default router;
