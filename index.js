require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PAGE_ID = process.env.PAGE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const AI_ENDPOINT = process.env.AI_ENDPOINT;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
function generateDynamicPrompt() {
  const topics = process.env.TOPICS.split(",");
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const seed = Date.now(); // optional for uniqueness

  return `Generate 10 unique technical interview questions and detailed answers on the topic: "${randomTopic}". The questions should vary from beginner to advanced level, covering core concepts, architecture, and best practices with hashTags. [session:${seed}] `;
}

async function generateContent(prompt) {
  try {
    const res = await axios.post(AI_ENDPOINT, {
      messages: [{ role: "user", content: prompt }],
      model: "openai",
      jsonMode: false,
    });
    // console.log("AI response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}
async function postToFacebook(message) {
  try {
    const res = await axios.post(`${GRAPHQL_ENDPOINT}${PAGE_ID}/feed`, {
      message: message,
      access_token: ACCESS_TOKEN,
    });
    return "Post successful: " + res;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    return null
  }
}

app.get("/", async (req, res) => {
  res.send("Server is running");
});

// GET /test/your_secret_key hehehe you can't access this endpoint
app.get("/test/:id", async (req, res) => {
  const secret = req.params.id;

  if (secret !== process.env.SECRET_KEY) {
    return res.status(403).send("Unauthorized");
  }

  const content = await generateContent(generateDynamicPrompt());
  await postToFacebook(content);
  res.end();
});

app.listen(
  PORT
  //   () => {
  //   console.log(`Example app listening at http://localhost:${PORT || 3000}`);
  // }
);
