const express = require('express');

const router = express.Router();

router.get("/test",(req,res)=>{
    res.send("Auth route is working")
});

module.exports = router;
