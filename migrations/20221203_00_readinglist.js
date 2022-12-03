const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('readinglists', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            blogId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'blogs',
                    key: 'id'
                }
            },
            read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('readinglists')
    }
}