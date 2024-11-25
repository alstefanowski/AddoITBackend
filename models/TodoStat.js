const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const TodoStat = sequelize.define("TodoStat", {
        userId: {
            type: DataTypes.INTEGER,
            referenes: {model: 'Users', key: 'id'}
        },
        totalCompletedTasks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        totalTimeSpent: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        lastUpdated: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        },
        dateCompleted: {
            type: DataTypes.DATE
        }
    });

    TodoStat.associate = (model) => {
        TodoStat.belongsTo(model.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
        TodoStat.belongsTo(model.todo, { foreignKey: 'todoId', onDelete: 'CASCADE'});
    };

    return TodoStat;
}