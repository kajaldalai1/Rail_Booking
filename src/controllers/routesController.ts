import { Request, Response } from "express";
import { pool } from '../db';

export const getRoutesForTrain = async (req: Request, res: Response) => {
    const { trainId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM routes WHERE train_id = $1 ORDER BY stop_number', [trainId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(500).json({ error: err });
    }
};