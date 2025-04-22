const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ Use node-fetch (v2)
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/jobs", async (req, res) => {
  try {
    const response = await fetch("https://arbeitnow.com/api/job-board-api");
    if (!response.ok) throw new Error("Failed to fetch jobs");

    const data = await response.json();

    // ✅ Ensure the response has a "data" or "jobs" array
    const jobs = data.jobs || data.data || [];

    if (!Array.isArray(jobs)) {
      throw new Error(
        "Invalid API response format - Expected an array under 'jobs' or 'data'"
      );
    }

    res.json({ jobs }); // Send only the extracted jobs array
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
        }),
      }
    );

    const data = await openaiRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat API failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
