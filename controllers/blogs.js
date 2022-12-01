const router = require('express').Router()
const { Blog } = require('../models/index')
const { User } = require('../models/index')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({})
    console.log(JSON.stringify(blogs, null, 2))
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
      // const { title, author, url } = req.body
      const user = await User.findByPk(req.decodedToken.id)
      console.log(user)
      // const userId = req.decodedToken.id
      const blog = await Blog.create({...req.body, userId: req.decodedToken.id, likes: 0})
      console.log(blog)
      res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  
  router.delete('/:id', blogFinder, async (req, res) => {
    const blog = await req.blog.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!blog) {
      res.status(404).send('Blog not found!')
    } else {
      res.status(204).send('Blog deleted').end()
    }
  })

  router.put('/:id', blogFinder, async (req, res) => {
    const blog = req.blog
    blog.likes = blog.likes + 1
    await blog.save()
    res.json({ likes: blog.likes })
    
  })

module.exports = router