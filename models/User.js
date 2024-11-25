const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        LVL: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        experiencePoints: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        coins: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        purchasedThemes: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: []
        },
        password: {
            type: Sequelize.STRING
        },
        emailVerificationToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        tasksCompleted: {
            type: Sequelize.INTEGER
        },
        dailyTodo: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        dailyHabit: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }); 

    User.associate = (models) => {
        User.hasMany(models.Todo, { foreignKey: 'userId' });
        User.hasMany(models.Habit, { foreignKey: 'userId' });
        User.hasMany(models.Milestone, { foreignKey: 'userId' });
        User.hasMany(models.Quest, { foreignKey: 'userId' });
    };
    
    // {
    //     tableName: 'User'
    // });
    return User; 
}