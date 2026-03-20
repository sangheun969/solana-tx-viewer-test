"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const price_1 = __importDefault(require("./routes/price"));
const exchangeRate_1 = __importDefault(require("./routes/exchangeRate"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://sangheun969.github.io"],
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("Dex Viewer Server Running");
});
app.use("/api/price", price_1.default);
app.use("/api/exchange-rate", exchangeRate_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
