const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const generalController = require("./../controllers/generalController");
router.get("/contents", generalController.getContent);
router.get("/contents/:_id", generalController.getContent);
router.get("/home_config",generalController.getHomeConfig);
module.exports = router;
