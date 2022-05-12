const express = require('express');
const database = require('../models/Database');
const router = express.Router();
const db = require("../models/Database");

router.get("/films", function(req, res, next) {
    let db=database.getInstance();
    res.status(200).send("ciao");
});

module.exports=router;