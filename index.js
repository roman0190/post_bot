require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PAGE_ID = process.env.PAGE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const AI_ENDPOINT = process.env.AI_ENDPOINT;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const SECRET_KEY = process.env.SECRET_KEY;

const postQueue = []; // 🧠 in-memory store
console.log(postQueue);
function generateDynamicPrompt() {
  const topics = process.env.TOPICS.split(",");
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const seed = Date.now();
  return `Generate 10 unique technical interview questions and detailed answers on the topic: "${randomTopic}". Vary levels (beginner to advanced), core concepts. Use hashtags. No intro text. [session:${seed}]`;
}

async function generateContent(prompt) {
  try {
    const res = await axios.post(AI_ENDPOINT, {
      messages: [{ role: "user", content: prompt }],
      model: "openai",
      jsonMode: false,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error generating content:", error.message);
    return null;
  }
}

async function postToFacebook(message) {
  try {
    const res = await axios.post(`${GRAPHQL_ENDPOINT}${PAGE_ID}/feed`, {
      message: message,
      access_token: ACCESS_TOKEN,
    });
    return "✅ Posted to Facebook, ID: " + res.data.id;
  } catch (error) {
    console.error("❌ Error posting to Facebook:", error.message);
    return null;
  }
}

// Home
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// ➕ Route: /generate/:id — generates and stores content
app.get("/generate/:id", async (req, res) => {
  if (req.params.id !== SECRET_KEY)
    return res.status(403).send("❌ Unauthorized");

  const prompt = generateDynamicPrompt();
  const content = await generateContent(prompt);

  if (content) {
    postQueue.push(content);
    res.send(`✔️ Content added to queue. Queue length: ${postQueue.length}`);
  } else {
    res.status(500).send("❌ Failed to generate content.");
  }
});

// 📤 Route: /post/:id — posts one item and deletes it
app.get("/post/:id", async (req, res) => {
  if (req.params.id !== SECRET_KEY)
    return res.status(403).send("❌ Unauthorized");

  if (postQueue.length === 0) {
    return res.send("⚠️ Queue is empty. Nothing to post.");
  }

  const contentToPost = postQueue.shift();
  const result = await postToFacebook(contentToPost);

  if (result) {
    res.send("📤 Successfully posted and removed from queue.");
  } else {
    res.status(500).send("❌ Posting failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
