const _ = require("lodash");
const { Content } = require("../models/contents");
const getContent = async (req, res) => {
  try {
    let contents = null;
    let params = req.params || {};
    if (_.keysIn(params).length) {
      contents = await Content.find(params);
    } else {
      contents = await Content.find({ status: "active" });
    }
    res.status(200).send({
      _status: "success",
      _data: contents
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

module.exports = {
  getContent,
};
