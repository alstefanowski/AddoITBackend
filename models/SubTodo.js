const {Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const SubTodo = sequelize.define("SubTodo", {
        todoId: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isFinished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        timeStamps: false,
        createdAt: false,
        updatedAt: false
    })

    SubTodo.associate = (models) => {
        SubTodo.belongsTo(models.Todo);
    }
    return SubTodo;
}