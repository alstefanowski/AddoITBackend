const {Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const LevelRewards = sequelize.define("LevelRewards", {
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        experienceThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        goldReward: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'level_rewards',
        timestamps: false,
    });

    return LevelRewards;
}