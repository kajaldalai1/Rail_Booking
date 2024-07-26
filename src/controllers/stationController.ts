import { Request, Response } from 'express';
import { pool } from '../db';
import { bookingSchema } from '../validations/schemas';


export const getAllStations = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM stations');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching stations:', err);
        res.status(500).json({ error: err });
    }
};