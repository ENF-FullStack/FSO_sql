const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res, next) => {
    const users = await User.findAll({})
    res.json(users)
})

router.post('/', async (req, res, next) => {
      const user = await User.create(req.body)
      res.json(user)
  })
  
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (!user) {
    res.status(404).send(`User not found`)
  } else {
    user.username = req.body.username
    await user.save()
    res.json({ username: user.username })
  }
})

module.exports = router