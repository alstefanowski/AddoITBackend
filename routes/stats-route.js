const statController = require("../controllers/stats-controller")
const authJwt = require("../middleware/auth-jwt")

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
      });
  
      app.get("/api/stats/todo/:id", statController.fetchTodoStats);
      app.post("/api/stats/todo", statController.saveTodoStats);
      app.get("/api/stats/habit/:id", statController.fetchHabitStats);
      app.post("/api/stats/habit", statController.saveHabitStats);
      app.get("/api/stats/level-stats", statController.getLevelInfo);
      app.post("/api/stats/quests/create", statController.createQuest);
      app.get("/api/stats/quests/check-completion/:userId/:type", statController.checkQuestCompletion);
}