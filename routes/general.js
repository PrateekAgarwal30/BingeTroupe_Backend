const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const generalController = require("./../controllers/generalController");
router.get("/contents", generalController.getContent);
router.get("/contents/:_id", generalController.getContent);
module.exports = router;