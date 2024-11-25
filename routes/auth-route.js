const { verifySignUp } = require("../middleware/index.js");
const controller = require("../controllers/auth-controller.js");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post("/api/auth/signup", verifySignUp.checkIfUserAlreadyExists, controller.signup);
    app.post("/api/auth/signin", controller.signin);
    app.get("/api/auth/verify-email", controller.verifyEmail);
    
    app.patch("/api/auth/update-username/:id", controller.updateUsername);
    app.patch("/api/auth/update-email/:id", controller.updateEmail);
    app.patch("/api/auth/update-password/:id", controller.updatePassword);

    app.post("/api/auth/forgot-password", controller.forgotPassword);
    app.post("/api/auth/reset-password", controller.resetPassword);
    app.delete("/api/auth/delete/:id", controller.delete);
    
    app.post("/api/auth/delete/:id", controller.delete);
    app.post("/api/auth/complete-tasks/:id", controller.completeTask); 
    app.post("/api/auth/update-theme", controller.updateThemes);
    

    app.get("/api/auth/shop-data/:id", controller.getUserGoods);
    app.patch("/api/auth/shop-data/:id", controller.updateCoins);
    app.patch("/api/auth/update-quest/:id", controller.updateQuest);
  };