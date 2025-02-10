const express = require("express");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, email, clerkId } = req.body;

    if (!name || !email || !clerkId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sql`
      INSERT INTO users (name, email, clerk_id) 
      VALUES (${name}, ${email}, ${clerkId})
      RETURNING *;`;

    // ✅ Return response in the requested format
    return res.status(201).send(
      new Response(JSON.stringify({ data: response[0] }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
