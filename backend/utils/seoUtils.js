const axios = require("axios");
const { TEXTRAZOR_API_KEY } = require("../config/keys");

async function analyzeSEO(text) {
  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("extractors", "entities,topics,words");

    const response = await axios.post(
      "https://api.textrazor.com/",
      params.toString(),
      {
        headers: {
          "x-textrazor-key": TEXTRAZOR_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "TextRazor API error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

function extractKeywords(textrazorData) {
  if (!textrazorData.response) return [];

  // Try to extract entities first if available
  if (
    textrazorData.response.entities &&
    textrazorData.response.entities.length > 0
  ) {
    return textrazorData.response.entities
      .map((e) => e.matchedText)
      .filter((v, i, a) => a.indexOf(v) === i); // unique
  }

  // Otherwise fallback to extracting from words
  if (textrazorData.response.words && textrazorData.response.words.length > 0) {
    // Filter out punctuation and very short words
    const filteredWords = textrazorData.response.words.filter(
      (w) => w.partOfSpeech !== "PUNCT" && w.lemma.length > 2
    );

    const uniqueLemmas = Array.from(
      new Set(filteredWords.map((w) => w.lemma.toLowerCase()))
    );

    return uniqueLemmas;
  }

  return [];
}

function insertKeyword(text, keyword) {
  if (!text.includes(".")) {
    return text + " " + keyword;
  }
  const idx = text.indexOf(".");
  return text.slice(0, idx) + " " + keyword + text.slice(idx);
}

module.exports = { analyzeSEO, extractKeywords, insertKeyword };
