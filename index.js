import express from "express";
import dotenv from "dotenv";
import { z } from "zod";
import pool from "./config/postgres.config.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const validateRequest = (headers) => {
  if (!headers["x-userid"]) {
    throw new Error("Missing x-userId header");
  }
};

const QUERY_SCHEMA = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});

app.post("/api/v1/ask-jiji", async (req, res) => {
  try {
    validateRequest(req.headers);
    const { success, data, error } = QUERY_SCHEMA.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: error.issues[0].message || "Unknown error",
      });
    }
    // const { query } = data;
    const client = await pool.connect();
    if (!client) {
      return res
        .status(500)
        .json({ message: "Failed to connect to the database" });
    }
    return res.json({ answer: "This is a mock answer from Jiji." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log("Server started on port", PORT || 3000);
});
