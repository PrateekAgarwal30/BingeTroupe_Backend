const _ = require("lodash");
const { Content } = require("../models/contents");
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
  thriller: "Thriller",
};

const getContent = async (req, res) => {
  try {
    let contents = null;
    let params = req.params || {};
    let returnData = null;
    if (_.keysIn(params).length) {
      contents = await Content.find(params);
      returnData = contents;
    } else {
      contents = await Content.find({ status: "active", ...req.query });
      returnData = contents;
    }
    if (params._id && contents) {
      contents = contents[0];
      returnData = _.pick(contents, [
        "_id",
        "name",
        "status",
        "genres",
        "type",
        "subtitle",
        "body",
        "contentImgHorizontalUrl",
        "contentImgVeritcalUrl",
        "contentTmbImgHorizontalUrl",
        "contentTmbImgVeritcalUrl",
        "contentVideoUrl",
        "durationinMillSec",
        "uploadDate",
        "releaseDate",
        "language",
      ]);
      const similarContent = await Content.find(
        {
          $and: [
            { genres: { $in: contents.genres } },
            { _id: { $ne: contents._id } },
          ],
        },
        {
          name: 1,
          contentTmbImgHorizontalUrl: 1,
          contentTmbImgVeritcalUrl: 1,
        }
      ).limit(6);
      returnData.similarContent = similarContent || [];
      // console.log(returnData);
    }
    res.status(200).send({
      _status: "success",
      _data: returnData,
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message,
    });
  }
};

const getHomeConfig = async (req, res) => {
  try {
    let homeConfig = {};
    const genresAggregate = await Content.aggregate([
      { $match: { status: "active" } },
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          count: { $sum: 1 },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          data: {
            $slice: ["$data", 0, 4],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    homeConfig.banners = [
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg",
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg",
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg",
      },
      {
        thumbnail:
          "https://storage.googleapis.com/brunch-pvt-ltd.appspot.com/banners/sintel-poster.jpg",
      },
    ];

    homeConfig.genresData = [];

    for (var i = 0; i < genresAggregate.length; i++) {
      homeConfig.genresData.push({
        title: genresTitle[genresAggregate[i]._id],
        count: genresAggregate[i].count,
        genreId: genresAggregate[i]._id,
        data: [{ flatListData: genresAggregate[i].data }],
      });
    }
    res.status(200).send({
      _status: "success",
      _data: homeConfig,
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message,
    });
  }
};

const getSearchSuggestion = async (req, res) => {
  try {
    const searchResult = await Content.find(
      {
        $or: [
          { $text: { $search: `${req.query.searchText || ""}` } },
          { name: { $regex: `${req.query.searchText || ""}`, $options: "i" } },
          {
            subtitle: {
              $regex: `${req.query.searchText || ""}`,
              $options: "i",
            },
          },
          { body: { $regex: `${req.query.searchText || ""}`, $options: "i" } },
        ],
      },
      {
        score: { $meta: "textScore" },
        name: 1,
        contentTmbImgHorizontalUrl: 1,
        genres: 1,
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
    const formattedData = _.map(searchResult, (result) => {
      result.genres = _.map(
        result.genres,
        (genre) => (genre = genresTitle[genre])
      );
      return result;
    });
    res.status(200).send({
      _status: "success",
      _data: formattedData,
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message,
    });
  }
};

const fetchWatchListData = async (req, res) => {
  try {
    const watchList = _.get(req, "body.watchList", []) || [];
    const watchListData = await Content.find({ _id: { $in: watchList } });
    res.status(200).send({
      _status: "success",
      _data: watchListData,
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message,
    });
  }
};

module.exports = {
  getContent,
  getHomeConfig,
  getSearchSuggestion,
  fetchWatchListData,
};
