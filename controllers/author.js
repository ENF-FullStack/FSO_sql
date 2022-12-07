const router = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res, next) => {
  const authors = await Blog.findAll({
    group: ["author"],
    attributes: [
      "author",
      //? counting number of blogs for each author
      [sequelize.fn("COUNT", "author"), "blogs"],

      //? total number of likes per author
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    //? order by likes
    order: [[sequelize.fn("max", sequelize.col("likes")), "DESC"]],
  });
  res.json(authors);
});

module.exports = router;
