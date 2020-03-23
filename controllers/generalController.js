const _ = require("lodash");
const { Content } = require("../models/contents");
const getContent = async (req, res) => {
  try {
    let contents = null;
    let params = req.params || {};
    if (_.keysIn(params).length) {
      contents = await Content.find(params);
    } else {
      contents = await Content.find({ status: "active", ...req.query });
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

const getHomeConfig = async (req, res) => {
  try {
    let homeConfig = {};
    const genres = [
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
    ];
    //Have to write API for Banner
    homeConfig.banners = [
      {
        thumbnail:
          "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
      },
      {
        thumbnail:
          "https://www.telegraph.co.uk/content/dam/music/2016/09/23/nirvana_trans_NvBQzQNjv4Bqeo_i_u9APj8RuoebjoAHt0k9u7HhRJvuo-ZLenGRumA.jpg?imwidth=1400"
      }
    ];
    homeConfig.genresData = [];
    for (var i = 0; i < genres.length; i++) {
      let data = await Content.find({ status: "active", genres: genres[i] });
      if (data && data.length) {
        homeConfig.genresData.push({
          title: genres[i],
          data: data
        });
      }
    }
    res.status(200).send({
      _status: "success",
      _data: homeConfig
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
  getHomeConfig
};
