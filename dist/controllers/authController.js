"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const schemas_1 = require("../validations/schemas");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = schemas_1.userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { username, password, email } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id';
    const values = [username, hashedPassword, email];
    try {
        const result = yield db_1.pool.query(query, values);
        res.status(201).json({ userId: result.rows[0].id });
    }
    catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = schemas_1.loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    try {
        const result = yield db_1.pool.query(query, values);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
            if (isValidPassword) {
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            }
            else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        }
        else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: err });
    }
});
exports.login = login;
