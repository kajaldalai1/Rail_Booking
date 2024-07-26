-- Creating the users table with pincode and state columns
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    state VARCHAR(50) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating the trains table
CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    train_name VARCHAR(100) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    train_departure_time TIMESTAMP NOT NULL,
    train_arrival_time TIMESTAMP NOT NULL,
);


-- Creating the stations table
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- Creating the routes table with correct foreign key references
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(train_id) ON DELETE CASCADE,
    station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
    stop_number INTEGER NOT NULL,
    arrival_time TIMESTAMP,
    departure_time TIMESTAMP
);



CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER REFERENCES trains(id) ON DELETE CASCADE,
    class_number VARCHAR(20) NOT NULL,
    total_seats INTEGER NOT NULL
);


-- Create the bookings table with a foreign key reference to the class table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    train_id INTEGER REFERENCES trains(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('online', 'offline')),
    class_id INTEGER REFERENCES class(id),
    journey_date DATE,
    ticket_price DECIMAL(10, 2) NOT NULL
);



