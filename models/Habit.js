const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Habit = sequelize.define(
        'Habit', 
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: { 
                type: Sequelize.INTEGER,
                references: { model: 'Users', key: 'id' }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isFinished: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            streak: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            completionsDate: {
                type: DataTypes.JSON,
            },
            group: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dateGoal: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isSynced: {
                type: DataTypes.BOOLEAN,
                allowNull: false                
            },
            time: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            datePicker: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            notification: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            daysNotificationSelected: {
                type: DataTypes.JSON, 
                allowNull: true,
            },
            weekDaysSelected: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            goalDuration: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }
    );
    Habit.associate = (models) => {
        Habit.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };

    return Habit;
};
