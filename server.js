import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import connectDB from "./db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//routes
import queryRoutes from "./routes/faq.routes.js";
app.use("/api/faqs", queryRoutes);

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
})
.catch((error) => {
    console.log("Error in connecting to DB", error);
})

export default app;
