const router = require("express").Router();
const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res, next) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId", "created_at", "updated_at"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  const user = await User.create({
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  });
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const where = {
    userId: req.params.id,
  };

  if (req.query.read === "true") {
    where.read = true;
  } else {
    where.read = false;
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "created_at", "updated_at"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "created_at", "updated_at"] },
        through: {
          attributes: [],
        },
        include: {
          model: ReadingList,
          where,
          attributes: ["id", "read"],
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (!user) {
    res.status(404).send(`User not found`);
  } else {
    user.username = req.body.username;
    user.updated_at = new Date();
    await user.save();
    res.json({ username: user.username });
  }
});

module.exports = router;
