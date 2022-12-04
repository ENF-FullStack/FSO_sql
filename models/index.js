const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

//? old syncs
// Blog.sync()
// User.sync()

User.hasMany(Blog)
Blog.belongsTo(User)

//? m2m relationships between user and blog through connection table readingList
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'saved_by' })

//? old syncs, not required with migrations
// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
    Blog, User, ReadingList
}