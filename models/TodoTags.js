const {Sequelize, DataTypes} = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const TodoTags = sequelize.define("TodoTags", {
        todoId: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        tagId: {
            type: Sequelize.BIGINT,
            allowNull: false
        }
        
    }, {
        timeStamps: false,
        createdAt: false,
        updatedAt: false
    });
    return TodoTags;
}