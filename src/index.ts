import express from "express";
import cors from "cors";
import helmet from "helmet";

const authRoutes = require("./routes/auth.routes");
const cityRoutes = require("./routes/city.routes");
const authController = require("./controllers/auth.controller");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/api/auth", authRoutes);
app.get("/auth/google", authController.googleAuthRedirect);
app.get("/auth/google/callback", authController.googleAuthCallback);
app.use("/api/cities", cityRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
