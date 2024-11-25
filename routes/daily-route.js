const controller = require("../controllers/daily-controller.js");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
    });
    
    app.get('/api/daily', controller.resetDaily);
}