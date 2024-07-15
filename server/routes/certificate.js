const express = require("express");
const router = express.Router();

const { Certificate } = require("../models");


router.post("/create", async (req, res) => {
    let data = req.body;
    let result = await Certificate.create(data);
    res.json(result);
  });
  
  module.exports = router;