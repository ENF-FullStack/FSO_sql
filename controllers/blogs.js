const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
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
  
  router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  })
  
  router.delete('/:id', blogFinder, async (req, res) => {
    await req.blog.destroy()
    res.status(204).end()
  })

  router.put('/:id', blogFinder, async (req, res) => {
    const blog = req.blog
    blog.likes = blog.likes + 1
    await blog.save()
    res.json({ likes: blog.likes })
    
  })

module.exports = router