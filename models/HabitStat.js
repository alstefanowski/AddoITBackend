const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const HabitStat = sequelize.define("HabitStat", {
        userId: {
            type: DataTypes.INTEGER,
            referenes: {model: 'Users', key: 'id'}
        },
        biggestStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        weekDaysCompleted: {
            type: DataTypes.JSONB,
            allowNull: false
        },

        lastUpdated: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    HabitStat.associate = (model) => {
        HabitStat.belongsTo(model.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
    }
    return HabitStat;
}