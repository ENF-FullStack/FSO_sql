const router = require("express").Router();

const { ReadingList } = require("../models");

router.post("/", async (req, res) => {
  console.log("readinglist", ReadingList);
  const newList = await ReadingList.create({ ...req.body, read: false });
  res.json(newList);
});

router.put("/:id", async (req, res) => {
  const readList = await ReadingList.findByPk(req.params.id);
  console.log(readList);

  if (readList) {
    if (req.decodedToken.id !== readList.userId) {
      return res
        .status(401)
        .json({ error: "Error: No permission to change blog status" });
    }
    readList.read = req.body.read;
    await readList.save();
    return res.json(readList);
  }
  return res.status(404).json({ error: "Error: No blog found" });
});

module.exports = router;
