const mongoose = require("mongoose");
const translationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please fill the input text"],
  },
  translatedText: {
    type: String,
    required: [true, "Please fill the output text"],
  },
  from: {
    type: String,
    required: [true, "Please fill the output text"],
  },
  to: {
    type: String,
    required: [true, "Please fill the output text"],
  },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("Translation", translationSchema);
