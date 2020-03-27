const _ = require("lodash");
const Fawn = require("fawn");
const sharp = require("sharp");
const uploadImageToStorage = require("../utils/uploadImageToStorage");
const { Content, validateContent } = require("../models/contents");
const postNewContent = async (req, res) => {
  const contentImage = req.files.contentImage;
  const contentVideo = req.files.contentVideo;
  try {
    if (
      !contentImage ||
      !contentImage.length ||
      !(
        contentImage[0].mimetype === "image/jpeg" ||
        contentImage[0].mimetype === "image/png"
      )
    ) {
      throw new Error(
        "Content Image not passed.\nPlease select png/jpg file only."
      );
    }
    if (
      !contentVideo ||
      !contentVideo.length ||
      contentVideo[0].mimetype != "video/mp4"
    ) {
      throw new Error(
        "Content Video not passed.\nPlease select mp4 file only."
      );
    }
    let contentDeatils = _.pick(req.body, [
      "name",
      "status",
      "type",
      "subtitle",
      "body",
      "genres"
    ]);
    if (
      contentDeatils.genres &&
      contentDeatils.genres[0] === "[" &&
      contentDeatils.genres[contentDeatils.genres.length - 1] === "]"
    ) {
      var replace = contentDeatils.genres.replace(/[\[\]]/g, "");
      contentDeatils.genres = replace.split(",");
    }
    let { error } = validateContent(contentDeatils);
    if (error) {
      throw new Error(error);
    }
    const imageThumbBuffer = await sharp(contentImage[0].buffer)
      .webp({ quality: 25 })
      .toBuffer();
    const imageThumbInfo = {
      buffer: imageThumbBuffer,
      mimetype: "image/png",
      uploadFileName: `contentThumbmail/content_${Date.now()}`
    };
    const uploadThumbnailImageResponse = await uploadImageToStorage(
      imageThumbInfo
    );
    contentImage[0].uploadFileName = `contentImage/content_${Date.now()}`;
    const uploadImageResponse = await uploadImageToStorage(contentImage[0]);
    contentVideo[0].uploadFileName = `contentVideo/content_${Date.now()}`;
    const uploadVideoResponse = await uploadImageToStorage(contentVideo[0]);
    contentDeatils["contentImageUrl"] = uploadImageResponse;
    contentDeatils["contentThumbnailUrl"] = uploadThumbnailImageResponse;
    contentDeatils["contentVideoUrl"] = uploadVideoResponse;
    const newContent = new Content({
      ...contentDeatils
    });
    await newContent.save();
    res.status(200).send({
      _status: "success",
      _data: { newContent }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

module.exports = {
  postNewContent
};
