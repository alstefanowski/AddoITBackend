const { DataTypes } = require("sequelize")


module.exports = (sequelize) => {
    const Quest = sequelize.define('Daily', {
        type: {
            type: DataTypes.ENUM("todo", "habit"),
            allowNull: false
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    });

    Quest.associate = (models) => {
        Quest.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Quest;
}