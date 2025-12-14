// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import quizRoutes from "../routes/quizRoutes.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/quiz", quizRoutes);

// const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Backend is live 🚀" });
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "../routes/quizRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is live 🚀" });
});

export default app;

