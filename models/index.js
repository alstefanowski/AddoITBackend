const { pool } = require('../config/db_config');
const config = require('../config/db_config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.DIALECT,
        pool: {
            max: config.POOL.max,
            min: config.POOL.min,
            acquire: config.POOL.acquire,
            idle: config.POOL.idle
        }
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.user = require("./User.js")(sequelize, Sequelize);
db.todo = require("./Todo.js")(sequelize, Sequelize);
db.habit = require("./Habit.js")(sequelize, Sequelize);
db.token = require("./Token.js")(sequelize, Sequelize);
db.Tag = require("./Tag.js")(sequelize, Sequelize);
db.TodoTags = require("./TodoTags.js")(sequelize, Sequelize);
db.SubTodo = require("./SubTodo.js")(sequelize, Sequelize);
db.Quest = require("./Quest.js")(sequelize, Sequelize);
db.milestone = require("./Milestone.js")(sequelize, Sequelize);
db.TodoStat = require("./TodoStat.js")(sequelize, Sequelize);
db.HabitStat = require("./HabitStat.js")(sequelize, Sequelize);
db.LevelReward = require("./LevelReward.js")(sequelize, Sequelize);

module.exports = db;