const Joi = require("joi");
const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "in_active"],
    required: true
  },
  type: {
    type: String,
    enum: ["movie", "web_series", "tv_series"],
    required: true
  },
  subtitle: {
    type: String,
    minlength: 5,
    maxlength: 150
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 300
  },
  contentImageUrl: {
    type: String,
    required: true
  },
  contentThumbnailUrl: {
    type: String,
    required: true
  },
  contentVideoUrl: {
    type: String,
    required: true
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
        "thriller"
      ],
      required: true
    }
  ]
});

const Content = mongoose.model("contents", contentSchema);

function validateContent(content) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    status: Joi.string()
      .valid("active", "in_active")
      .required(),
    type: Joi.string()
      .valid("movie", "web_series", "tv_series")
      .required(),
    subtitle: Joi.string()
      .min(5)
      .max(150),
    body: Joi.string()
      .min(5)
      .max(300)
      .required(),
    genres: Joi.array().items(
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
  };
  return Joi.validate(content, schema);
}

exports.Content = Content;
exports.validateContent = validateContent;
