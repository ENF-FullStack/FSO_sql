require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
var bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING(255),
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

app.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  // console.log(blogs.map(b => b.toJSON()))
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    console.log(blog.toJSON())
    res.json(blog)
  } else {
    res.status(400).end()
  }
})

// app.put('/api/blogs/:id', async (req, res) => {
//   const blog = await Blog.findByPk(req.params.id)
//   if (blog) {
//     blog.author = req.body.author
//     blog.url = req.body.url
//     blog.title = req.body.title
//     blog.likes = req.body.likes
//   } else {
//     res.status(400).end()
//   }
// })

app.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!blog)  { 
      res.status(400).send('Blog not found')
    } else res.json('Blog deleted')
  } catch(error) {
    console.log(error)
    res.status(500).send('Error: blog not deleted')
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})