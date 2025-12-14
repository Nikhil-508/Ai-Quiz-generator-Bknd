// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { topic, numQuestions = 5 } = req.body;

//   const prompt = `
//   Generate ${numQuestions} multiple-choice quiz questions about "${topic}".
//   Return the result strictly as valid JSON array like:
//   [
//     {"question": "What is ...?", "options": ["A", "B", "C", "D"], "answer": "B"}
//   ]
//   Do NOT include explanations or extra text.
//   `;

//   try {
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:5174",
//           "X-Title": "AI Quiz Generator",
//         },
//       }
//     );

//     const message = response.data.choices[0].message.content;
//     let quiz;
//     try {
//       quiz = JSON.parse(message);
//     } catch {
//       // fallback — try to extract JSON if there's extra text
//       const match = message.match(/\[.*\]/s);
//       quiz = match ? JSON.parse(match[0]) : [];
//     }

//     res.json({ quiz });
//   } catch (error) {
//     console.error("🔥 Error from OpenRouter:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to generate quiz" });
//   }
// });

// export default router;


import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY missing" });
  }

  const { topic, numQuestions = 5 } = req.body;

  const prompt = `
Generate ${numQuestions} multiple-choice quiz questions about "${topic}".
Return the result strictly as valid JSON array like:
[
  {"question":"What is ...?","options":["A","B","C","D"],"answer":"B"}
]
Do NOT include explanations.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      }
    );

    const data = await response.json();
    const content = data.choices[0].message.content;

    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch {
      const match = content.match(/\[.*\]/s);
      quiz = match ? JSON.parse(match[0]) : [];
    }

    res.json({ quiz });
  } catch (err) {
    console.error("OpenRouter error:", err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});

export default router;
