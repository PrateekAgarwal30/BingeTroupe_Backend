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
    const genres = await Content.distinct("genres");
    // console.log("genres", genres);
    const genresTitle = {
      action: "Action",
      adventure: "Adventure",
      comedy: "Comedy",
      crime: "Crime",
      drama: "Drama",
      fantasy: "Fantasy",
      historical: "Historical",
      horror: "Horror",
      mystery: "Mystery",
      philosophical: "Philosophical",
      political: "Political",
      romance: "Romance",
      sci_fi: "Science Fiction",
      thriller: "Thriller"
    };
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
      let data = await Content.find({ status: "active", genres: genres[i] },"-__v -body -genres -status").limit(5);
      if (data && data.length) {
        homeConfig.genresData.push({
          title: genresTitle[genres[i]],
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
