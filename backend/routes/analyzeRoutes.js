const express = require("express");
const {
  analyzeController,
  insertKeywordController,
} = require("../controllers/analyzeController");

const router = express.Router();

router.post("/analyze", analyzeController);
router.post("/insert-keyword", insertKeywordController);

module.exports = router;
