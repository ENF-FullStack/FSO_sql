const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` }},
        { author: { [Op.iLike]: `%${req.query.search}%` }}
      ]
    }
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId']},
    include: [{
        model: User,
        attributes: ['name']
    }], 
    where,
    order: [['likes', 'DESC']]
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
      if (!req.decodedToken) {
        throw new Error('You need to be logged to post a blog')
      }
      const user = await User.findByPk(req.decodedToken.id)
      console.log(user.id)

      //? 13.17 works
      const { title, author, url, year } = req.body

      //? 13.18 year-check
      if (year >= 1991 && year <= new Date().getFullYear()) {
        const blog = await Blog.create({
          title,
          author,
          url,
          year,
          userId: user.id,
          created_at: new Date(),
          updated_at: new Date()
        })
  
        // const blog = await Blog.create({...req.body, user_id: user.id, created_at: new Date(), updated_at: new Date()})
        res.json(blog)
      } else {
        res.status(400).json({
          error: 'Year must be between 1991 and this year'
        })
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
    if (!blog) {
      res.status(404).send('Blog not found')
    } else {
      blog.likes = blog.likes + 1
      blog.updated_at = new Date()
      await blog.save()
      res.json({ likes: blog.likes })
    }
  })

module.exports = router