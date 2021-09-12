const express = require("express");
const app = express();

const mongoose = require("mongoose");
require("dotenv").config();
require("./DB/models/translation");
const db = require("./db/server.js");

const PORT = process.env.PORT || 5000;

const Translation = mongoose.model("Translation");
const { Translate } = require("@google-cloud/translate").v2;

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const translator = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

app.use(express.json());

const detectLanguage = async (text) => {
  try {
    let res = await translator.detect(text);
    return res[0].language;
  } catch (error) {
    console.log("language not supported");
    res.json({
      done: false,
      error: error,
    });
    return 0;
  }
};

const translateText = async (text, to) => {
  try {
    let [res] = await translator.translate(text, to);
    return res;
  } catch (error) {
    console.log("language not supported");
    res.json({
      done: false,
      error: error,
    });
    return 0;
  }
};

app.post("/translate", async (req, res) => {
  try {
    const { text, to } = req.body;
    console.log(text);
    if (text === undefined || to === undefined)
      throw new Error("language not supported");

    const from = await detectLanguage(text);

    if (from === 0) throw new Error("language not supported");

    var response = await Translation.findOne({ text: text.toLowerCase(), to });
    var translatedText = undefined;

    if (response) {
      translatedText = response.translatedText;
    } else {
      response = await Translation.findOne({
        translatedText: text.toLowerCase(),
        from: to,
      });
      if (response) {
        translatedText = response.text;
      } else {
        translatedText = await translateText(text, to);
        if (translatedText === 0) throw new Error("language not supported");

        const lowerText = text.toLowerCase();

        const lowerTranslatedText = translatedText.toLowerCase();

        const res = await Translation.create({
          text: lowerText,
          translatedText: lowerTranslatedText,
          from,
          to,
        });
      }
    }

    res.json({
      done: true,
      translated: translatedText,
      original: text,
    });
  } catch (error) {
    // console.log(error);
    res.json({
      done: false,
      error: error,
    });
  }
});

module.exports = app;
