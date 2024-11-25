const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Milestone = sequelize.define("Milestone", {
        tasksRequired: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: { 
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        xpAwarded: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isAchieved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Milestone.associate = (model) => {
        Milestone.belongsTo(model.User, {
            foreignKey: "userId",
            onDelete: "CASCADE"
        });
    }
}