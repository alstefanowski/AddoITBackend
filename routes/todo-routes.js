const todoController = require("../controllers/todo-controller")
const authJwt = require("../middleware/auth-jwt")
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      next();
    });

    app.post("/api/todo", todoController.create);
    app.get("/api/todo/:id", todoController.findAll);
    app.get("/api/todo/update/:id", todoController.fetchUpdatedAt);
    //app.get("/api/todo/:id", todoController.findById)
    app.put("/api/todo/:id", todoController.update);
    app.patch("/api/todo/update-time/:id", todoController.updateTime);
    app.patch("/api/todo/update-status/:id", todoController.updateStatus);
    app.post("/api/todo/sync", todoController.syncTodos);
    app.delete("/api/todo/:id", todoController.delete);
    app.delete("/api/todo", todoController.deleteAll);

    //Tag
    app.post("/api/tag", todoController.createTag);
    app.delete("/api/tag", todoController.deleteTags);
    app.delete("/api/tag/:id", todoController.deleteTagById)
    //app.patch("/api/tag/update-status/:id")
}