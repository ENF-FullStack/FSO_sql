const Blog = require('./blog')
const User = require('./user')

//? old syncs
// Blog.sync()
// User.sync()

User.hasMany(Blog)
Blog.belongsTo(User)

User.sync({ alter: true })
Blog.sync({ alter: true })

module.exports = {
    Blog, User
}