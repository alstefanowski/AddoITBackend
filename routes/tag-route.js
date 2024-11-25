const tagController = require("../controllers/tag-controller")
const authJwt = require("../middleware/auth-jwt")

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
      });
      app.post("/api/tag", tagController.create);
      app.post("/api/tag/sync", tagController.syncTags);
}