const express = require('express');
const router = express.Router();

const { 
   testUser 
} = require("../controller/UsersController");

router.get("/", testUser);

module.exports = router;