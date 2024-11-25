const habitController = require("../controllers/habit-controller")
const authJwt = require("../middleware/auth-jwt")

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
      });
      app.post("/api/habit", habitController.create)
      app.put("/api/habit/:id", habitController.update)
      app.delete("/api/habit", habitController.deleteAll)
      app.post("/api/habit/sync", habitController.syncHabits);
      app.get("/api/habit/:id", habitController.fetchAll);
      //app.patch("/api/habit/:id", habitController.updateStreakAndCompletion);
}