// app.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";

import kategorijaRouter from "./routers/kategorijaRouter.mjs";
import transakcijaRouter from "./routers/transakcijaRouter.mjs";
import { bodyParser } from "./middlewares/middlewares.mjs";

const app = express();

app.use(cors(), bodyParser, express.json());

// Rute
app.use("/categories", kategorijaRouter);
app.use("/transactions", transakcijaRouter);

// Health
app.get("/health", (_req, res) => res.send({ message: "ok" }));

export default app;