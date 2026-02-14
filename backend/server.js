const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const invitationRoutes = require("./routes/invitationRoutes");


const app = express();

// ✅ CORS must come BEFORE routes
app.use(cors());
app.use(express.json());

connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/invitations", invitationRoutes);



app.get("/", (req, res) => {
  res.send("SplitEase backend is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
