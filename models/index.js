const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

//? old syncs
// Blog.sync()
// User.sync()

User.hasMany(Blog);
Blog.belongsTo(User);

//? m2m relationships between user and blog through connection table readingList
User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "saved_by" });

//? 11.23 relationships between blog and readinglist
Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

//? 11.24 relationships between user and session
User.hasMany(Session);
Session.belongsTo(User);

//? old syncs, not required with migrations
// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
