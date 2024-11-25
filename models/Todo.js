const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("Todo", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.BIGINT,
            referenes: {model: 'Users', key: 'id'}
        },
        syncedCalendarId: {
            type: Sequelize.BIGINT,
        },
        isFinished: {
            type: Sequelize.BOOLEAN
        },
        dateFinished: {
            type: DataTypes.DATE
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH')
        },
        deadline: {
            type: DataTypes.DATE
        },
        dateReminder: {
            type: DataTypes.DATE
        },
        timeSpent: {
            type: DataTypes.TIME,
            defaultValue: '00:00:00' 
        },
        isSynced: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    });

    Todo.associate = (models) => {
        Todo.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Todo.hasMany(models.SubTodo, { foreignKey: 'todoId', onDelete: 'CASCADE'})
        Todo.belongsToMany(models.Tag, { through: 'TodoTags'})
    };

    return Todo; 
}