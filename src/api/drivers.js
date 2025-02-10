const express = require("express");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const router = express.Router();

// Get all todos
router.get("/", async (_, res, next) => {
  try {
    const response = await sql`SELECT * FROM drivers`;
    return res.json({ data: response });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
