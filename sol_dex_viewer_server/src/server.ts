import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import priceRouter from "./routes/price";
import exchangeRateRouter from "./routes/exchangeRate";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://sangheun969.github.io",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Dex Viewer Server Running");
});

app.use("/api/price", priceRouter);
app.use("/api/exchange-rate", exchangeRateRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
