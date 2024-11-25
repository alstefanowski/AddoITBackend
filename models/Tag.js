const {Sequelize, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
    const Tag = sequelize.define("Tag", {
        tagId: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        // todoId: {
        //     type: DataTypes.BIGINT,
        //     allowNull: true,
        //     field: 'todo_foreignKey',
        //     references: {
        //         model: 'Todos',
        //         key: 'id'
        //     }
        // },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isSelected: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        tableName: 'Tags',
        timestamps: false
    });
    Tag.associate = (models) => {
        Tag.belongsToMany(models.Todo, {through: 'TodoTags'})
    }
    return Tag;
}