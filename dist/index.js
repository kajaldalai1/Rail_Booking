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
// src/index.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const trains_1 = __importDefault(require("./routes/trains"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const coaches_1 = __importDefault(require("./routes/coaches"));
const passengers_1 = __importDefault(require("./routes/passengers"));
const routes_1 = __importDefault(require("./routes/routes"));
const stations_1 = __importDefault(require("./routes/stations"));
const classes_1 = __importDefault(require("./routes/classes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/trains', trains_1.default);
app.use('/api/book', bookings_1.default);
app.use('/api/coach', coaches_1.default);
app.use('/api/passenger', passengers_1.default);
app.use('/api/route', routes_1.default);
app.use('/api/station', stations_1.default);
app.use('/api/class', classes_1.default);
app.get('/api', (req, res) => {
    res.send({
        status: 200,
        message: 'API is running',
    });
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${PORT}`);
    yield (0, models_1.createTables)();
}));
