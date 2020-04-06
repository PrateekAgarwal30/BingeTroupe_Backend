const _ = require("lodash");
const Fawn = require("fawn");
const sharp = require("sharp");
const uploadImageToStorage = require("../utils/uploadImageToStorage");
const { Content, validateContent } = require("../models/contents");
const postNewContent = async (req, res) => {
  const contentHortizontalImg = req.files.contentHortizontalImg;
  const contentVerticalImg = req.files.contentVerticalImg;
  const contentVideo = req.files.contentVideo;
  try {
    if (
      !contentHortizontalImg ||
      !contentHortizontalImg.length ||
      !(
        contentHortizontalImg[0].mimetype === "image/jpeg" ||
        contentHortizontalImg[0].mimetype === "image/png"
      )
    ) {
      throw new Error(
        "Content Hortizontal Image not passed.\nPlease select png/jpg file only."
      );
    }

    if (
      !contentVerticalImg ||
      !contentVerticalImg.length ||
      !(
        contentVerticalImg[0].mimetype === "image/jpeg" ||
        contentVerticalImg[0].mimetype === "image/png"
      )
    ) {
      throw new Error(
        "Content Vertical Image not passed.\nPlease select png/jpg file only."
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
      "genres",
      "durationinMillSec",
      "releaseDate",
      "language",
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

    const contentHzImgBuffer = await sharp(contentHortizontalImg[0].buffer)
      .webp({ quality: 25 })
      .toBuffer();
    const contentHortizontalImgInfo = {
      buffer: contentHzImgBuffer,
      mimetype: "image/png",
      uploadFileName: `contentHortizontalImg/content_${Date.now()}`,
    };

    const uploadHzImgRes = await uploadImageToStorage(
      contentHortizontalImgInfo
    );

    const contentHzTmbImgBuffer = await sharp(contentHzImgBuffer)
      .webp({ quality: 1 })
      .toBuffer();
    const contentHortizontalTmbImgInfo = {
      buffer: contentHzTmbImgBuffer,
      mimetype: "image/png",
      uploadFileName: `contentHortizontalTmbImg/content_${Date.now()}`,
    };

    const uploadHzTmbImgRes = await uploadImageToStorage(
      contentHortizontalTmbImgInfo
    );

    const contentVertImgBuffer = await sharp(contentVerticalImg[0].buffer)
      .webp({ quality: 25 })
      .toBuffer();
    const contentVerticalImgInfo = {
      buffer: contentVertImgBuffer,
      mimetype: "image/png",
      uploadFileName: `contentVerticalImg/content_${Date.now()}`,
    };
    const uploadVertImgRes = await uploadImageToStorage(contentVerticalImgInfo);
    const contentVertTmbImgBuffer = await sharp(contentVertImgBuffer)
      .webp({ quality: 1 })
      .toBuffer();
    const contentVerticalTmbImgInfo = {
      buffer: contentVertTmbImgBuffer,
      mimetype: "image/png",
      uploadFileName: `contentVerticalTmbImg/content_${Date.now()}`,
    };
    const uploadVertTmbImgRes = await uploadImageToStorage(
      contentVerticalTmbImgInfo
    );
    contentVideo[0].uploadFileName = `contentVideo/content_${Date.now()}`;
    const uploadVideoResponse = await uploadImageToStorage(contentVideo[0]);

    contentDeatils["contentTmbImgHorizontalUrl"] = uploadHzTmbImgRes;
    contentDeatils["contentTmbImgVeritcalUrl"] = uploadVertTmbImgRes;
    contentDeatils["contentImgVeritcalUrl"] = uploadVertImgRes;
    contentDeatils["contentImgHorizontalUrl"] = uploadHzImgRes;
    contentDeatils["contentVideoUrl"] = uploadVideoResponse;
    const newContent = new Content({
      ...contentDeatils,
    });
    await newContent.save();
    res.status(200).send({
      _status: "success",
      _data: { newContent },
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message,
    });
  }
};

module.exports = {
  postNewContent,
};
