# 🤖 Facebook AI Post Bot

Automatically generate and post technical interview questions and answers on your Facebook Page using OpenAI and Facebook Graph API. This project is ideal for automation of educational or technical content and runs every hour using `node-cron`.

---

## 📌 Features

- ✅ Posts every hour automatically to your Facebook page
- ✅ Randomly picks a popular tech topic (React, Node, Docker, etc.)
- ✅ Generates 10 unique questions & answers using AI
- ✅ Uses Facebook Graph API to publish post
- ✅ Easily deployable to services like Render

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js  
- **AI API:** OpenAI-compatible API (e.g., Pollinations)  
- **Scheduler:** node-cron  
- **HTTP:** Axios  
- **Deployment:** Render / Any Node.js hosting platform  

---

## 📁 Project Structure
post_bot/
│
├── index.js           # Main app logic
├── .env               # Secrets (Not pushed to GitHub)
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation

## 🛠️ How It Works
	1.	Every hour, cron.schedule() triggers.
	2.	generateDynamicPrompt() picks a topic randomly and formats the prompt.
	3.	The AI endpoint generates 10 Q&A based on the prompt.
	4.	The post is submitted to your Facebook page via Graph API.


## 👤 Author

👨‍💻 Roman Howladar
GitHub: @roman0190
