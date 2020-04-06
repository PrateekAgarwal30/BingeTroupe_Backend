const Joi = require("joi");
const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["active", "in_active"],
    required: true,
  },
  type: {
    type: String,
    enum: ["movie", "web_series", "tv_series"],
    required: true,
  },
  subtitle: {
    type: String,
    minlength: 5,
    maxlength: 150,
    index: true,
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 300,
    index: true,
  },
  contentImgHorizontalUrl: {
    type: String,
    required: true,
  },
  contentImgVeritcalUrl: {
    type: String,
    required: true,
  },
  contentTmbImgHorizontalUrl: {
    type: String,
    required: true,
  },
  contentTmbImgVeritcalUrl: {
    type: String,
    required: true,
  },
  contentVideoUrl: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: String,
      enum: [
        "action",
        "adventure",
        "comedy",
        "crime",
        "drama",
        "fantasy",
        "historical",
        "horror",
        "mystery",
        "philosophical",
        "political",
        "romance",
        "sci_fi",
        "thriller",
      ],
      required: true,
    },
  ],
  durationinMillSec: {
    type: Number,
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
  releaseDate: {
    type: Date,
  },
  language: {
    type: String,
    enum: ["english", "hindi"],
  },
});

contentSchema.index(
  { name: "text", subtitle: "text", body: "text" },
  {
    weights: {
      name: 4,
      subtitle: 2,
    },
    name: "SearchIndex",
  }
);
const Content = mongoose.model("contents", contentSchema);
function validateContent(content) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid("active", "in_active").required(),
    type: Joi.string().valid("movie", "web_series", "tv_series").required(),
    subtitle: Joi.string().min(5).max(150),
    body: Joi.string().min(5).max(300).required(),
    genres: Joi.array()
      .items(
        Joi.string().valid(
          "action",
          "adventure",
          "comedy",
          "crime",
          "drama",
          "fantasy",
          "historical",
          "horror",
          "mystery",
          "philosophical",
          "political",
          "romance",
          "sci_fi",
          "thriller"
        )
      )
      .required(),
    durationinMillSec: Joi.number().positive().required(),
    releaseDate: Joi.date().required(),
    language: Joi.string().valid("english", "hindi").required(),
  };
  return Joi.validate(content, schema);
}

exports.Content = Content;
exports.validateContent = validateContent;
