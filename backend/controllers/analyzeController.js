const {
  analyzeSEO,
  extractKeywords,
  insertKeyword,
} = require("../utils/seoUtils");

exports.analyzeController = async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }
  try {
    const seoData = await analyzeSEO(text);
    const keywords = extractKeywords(seoData);
    const readability = null; // Implement if needed
    res.json({ keywords, readability });
  } catch (e) {
    res.status(500).json({ error: "Failed to analyze SEO" });
  }
};

exports.insertKeywordController = (req, res) => {
  const { text, keyword } = req.body;
  if (!text || !keyword) {
    return res.status(400).json({ error: "Text and keyword required" });
  }
  const newText = insertKeyword(text, keyword);
  res.json({ updatedText: newText });
};
