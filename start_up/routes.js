const authRoute = require("../routes/auth");
const adminRoute = require("../routes/admin");
const meRoute = require("../routes/me");
const generalRoute = require("../routes/general");
module.exports = function routes(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/me", meRoute);
  app.use("/api/general", generalRoute);
  app.use("/api/admin", adminRoute);
  console.log("Routes Added");
};
