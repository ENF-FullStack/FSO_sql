var bodyParser = require("body-parser");
const express = require("express");
require("express-async-errors");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorRouter = require("./controllers/author");
const readinglistRouter = require("./controllers/readingList");
const tokenExtractor = require("./middleware/tokenExtractor");

const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/blogs", tokenExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", tokenExtractor, logoutRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", tokenExtractor, readinglistRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
