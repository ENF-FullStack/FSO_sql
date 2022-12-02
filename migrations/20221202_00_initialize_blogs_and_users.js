const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('blogs', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
              },
              author: {
                type: DataTypes.STRING(255),
              },
              url: {
                type: DataTypes.STRING(255),
                allowNull: false
              },
              title: {
                type: DataTypes.STRING(255),
                allowNull: false
              },
              likes: {
                type: DataTypes.INTEGER
              },
              created_at: {
                type: DataTypes.DATE,
                allowNull: false,
              },
              updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
              }
        })

        await queryInterface.createTable('users', {
          id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          username: {
              type: DataTypes.STRING,
              unique: true,
              allowNull: false,
              validate: {
                  isEmail: true
              }
          },
          name: {
              type: DataTypes.STRING,
              allowNull: false
          }
        })
        
        await queryInterface.addColumn('blogs', 'user_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id'}
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    }
}