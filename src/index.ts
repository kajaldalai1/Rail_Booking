// src/index.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { createTables } from './models';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import trainRoutes from './routes/trains';
import bookingRoutes from './routes/bookings';
import coachesRoutes from './routes/coaches';
import passengersRoutes from './routes/passengers';
import routesRoutes from './routes/routes';
import stationsRoutes from './routes/stations';
import classesRoutes from './routes/classes';


import path from 'path';
import { userSchema, loginSchema, bookingSchema } from './validations/schemas';


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/coach', coachesRoutes);
app.use('/api/passenger', passengersRoutes);
app.use('/api/route', routesRoutes);
app.use('/api/station', stationsRoutes);
app.use('/api/class', classesRoutes);


app.get('/api', (req, res) => {
  res.send({
    status: 200,
    message: 'API is running',
  });
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await createTables();
});
