const { User } = require("../models/user");
const { Detail, validateUpdateDetails } = require("../models/detail");
const _ = require("lodash");
const Fawn = require("fawn");
const sharp = require("sharp");
const uploadImageToStorage = require("../utils/uploadImageToStorage");

const getUserDetails = async (req, res) => {
  try {
    let user = await User.findById(req.userId, "-__v -password").populate(
      "details",
      "-__v -_id"
    );
    res.status(200).send({
      _status: "success",
      _data: user
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postUserDetails = async (req, res) => {
  try {
    const mDetails = _.pick(req.body, [
      "firstName",
      "lastName",
      "phoneNumber",
      "location",
      "dateOfBirth",
      "description"
    ]);
    const keys = Object.keys(mDetails);
    keys.map(x => {
      if (mDetails[x] === null) {
        delete mDetails[x];
      }
    });
    const { error } = validateUpdateDetails(mDetails);
    if (error) {
      if (
        error.details[0].message === 'firstName" is not allowed to be empty'
      ) {
        return res.status(400).send({
          _status: "fail",
          _message: "First Name is required"
        });
      } else {
        return res.status(400).send({
          _status: "fail",
          _message: error.details[0].message
        });
      }
    }
    let user = await User.findById(req.userId).select("details");
    if (user.details) {
      let details = await Detail.findById(user.details);
      keys.map(x => {
        if (mDetails[x]) {
          details[x] = mDetails[x];
        }
      });
      await details.save();
      res.status(200).send({
        _status: "success",
        _data: details
      });
    }
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postUserImage = async (req, res) => {
  try {
    const avatarFile = _.get(req, "file", null) || null;
    if (!avatarFile) {
      throw new Error(
        "Avatar Image not passed.\nPlease select png/jpg file only."
      );
    }
    let user = await User.findById(req.userId).select("details");
    if (!user.details) {
      throw new Error("User not found.\nPlease login again.");
    }
    const imageThumbBuffer = await sharp(req.file.buffer)
      .resize(200, 200)
      .png()
      .toBuffer();
    const imageThumbInfo = {
      buffer: imageThumbBuffer,
      mimetype: "image/png",
      uploadFileName: `avatarsThumbmail/avatar_${Date.now()}`
    };
    req.file.uploadFileName = `avatars/avatar_${Date.now()}`;
    const uploadThumbnailImageResponse = await uploadImageToStorage(
      imageThumbInfo
    );
    const uploadImageResponse = await uploadImageToStorage(req.file);
    let details = await Detail.findById(user.details);
    details.userImageUrl = uploadImageResponse;
    details.userImageThumbnail = uploadThumbnailImageResponse;
    await details.save();
    res.status(200).send({
      _status: "success",
      _data: details
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const postUserNotifToken = async (req, res) => {
  try {
    const { pushNotificationToken } = req.body;
    if (!pushNotificationToken) {
      res.status(400).send({
        _status: "fail"
      });
    }
    let user = await User.findById(req.userId).select("details");
    if (user.details) {
      let details = await Detail.findById(user.details);
      if (details["pushNotifToken"] !== pushNotificationToken) {
        details["pushNotifToken"] = pushNotificationToken;
        await details.save();
      }
      res.status(200).send({
        _status: "success"
      });
    }
  } catch (ex) {
    res.status(400).send({
      _status: "fail"
    });
  }
};

module.exports = {
  getUserDetails,
  postUserDetails,
  postUserImage,
  postUserNotifToken
};
