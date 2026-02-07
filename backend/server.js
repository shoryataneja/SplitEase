const express = require('express');
const authRoutes = require("./routes/authRoutes")

const app = express();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);



app.get("/",(req,res)=>{
    res.send("SplitEase backend is running")
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})

