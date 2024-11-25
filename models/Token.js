const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Token = sequelize.define("Token", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        
        timestamps: false
    });

    Token.prototype.isExpired = function () {
        const expirationTime = 3600 * 1000;
        return (new Date() - new Date(this.createdAt)) > expirationTime;
    };

    return Token;
};
