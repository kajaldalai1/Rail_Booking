// src/models/index.ts
import { pool } from '../db';

export const createTables = async () => {
  const queries = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trains (
      train_id SERIAL PRIMARY KEY,
      train_name VARCHAR(100) NOT NULL,
      source VARCHAR(100) NOT NULL,
      destination VARCHAR(100) NOT NULL,
      departure_time TIMESTAMP NOT NULL,
      arrival_time TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      city VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routes (
      id SERIAL PRIMARY KEY,
      train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
      station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
      stop_number INTEGER NOT NULL,
      arrival_time TIMESTAMP,
      departure_time TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS passengers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL,
      gender VARCHAR(10) NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      train_id INTEGER REFERENCES trains(id),
      booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      passenger_id INTEGER REFERENCES passengers(id) ON DELETE CASCADE,
      seat_number VARCHAR(10) NOT NULL,
      ticket_price DECIMAL(10, 2) NOT NULL,
      class VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS classes (
      id SERIAL PRIMARY KEY,
      train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
      class_name VARCHAR(50) NOT NULL,
      seat_capacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coaches (
      id SERIAL PRIMARY KEY,
      train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
      coach_number VARCHAR(10) NOT NULL,
      class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
      total_seats INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      amount DECIMAL(10, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL
    );
  `;
  await pool.query(queries);
};
