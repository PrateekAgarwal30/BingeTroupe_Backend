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
      { id: "action", name: "Action" },
      { id: "adventure", name: "Adventure" },
      { id: "comedy", name: "Comedy" },
      { id: "crime", name: "Crime" },
      { id: "drama", name: "Drama" },
      { id: "fantasy", name: "Fantasy" },
      { id: "historical", name: "Historical" },
      { id: "horror", name: "Horror" },
      { id: "mystery", name: "Mystery" },
      { id: "philosophical", name: "Philosophical" },
      { id: "political", name: "Political" },
      { id: "romance", name: "Romance" },
      { id: "sci_fi", name: "Science Fiction" },
      { id: "thriller", name: "Thriller" }
    ];
    //Have to write API for Banner
    homeConfig.banners = [
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg"
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg"
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg"
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg"
      }
    ];
    homeConfig.genresData = [];
    for (var i = 0; i < genres.length; i++) {
      let data = await Content.find({ status: "active", genres: genres[i].id });
      if (data && data.length) {
        homeConfig.genresData.push({
          title: genres[i].name,
          data: [{ flatListData: data }]
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
