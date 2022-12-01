const router = require('express').Router()
const { Blog, User } = require('../models/index')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`
    }
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId']},
    include: [{
        model: User,
        attributes: ['name']
    }], where
  })

  res.json(blogs)
})
  
  router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      console.log(req.blog.toJSON())
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })
  
  router.post('/', async (req, res, next) => {
    try {
      if (!req.decodedToken) {
        throw new Error('You need to be logged to post a blog')
      }
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.create({...req.body, userId: req.decodedToken.id, likes: 0})
      res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  
  router.delete('/:id', blogFinder, async (req, res) => {
    if (!req.decodedToken) {
      throw new Error('Log in to deleter your blogs')
    }

    const blog = await Blog.findOne({
      where: {
        id: req.params.id
      }
    })
    console.log(blog)

    if (!blog) {
      throw new Error('Blog not found')
    }

    if (blog.userId !== req.decodedToken.id) {
      throw new Error('Error: cannot delete blogs you dont create')
    }

    await blog.destroy()
    res.json({ message: 'Blog deleted'})
    // res.status(204).send('Blog deleted')
    }
  )

  router.put('/:id', blogFinder, async (req, res) => {
    const blog = req.blog
    blog.likes = blog.likes + 1
    await blog.save()
    res.json({ likes: blog.likes })
    
  })

module.exports = router