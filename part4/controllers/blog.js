const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (_, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user
  })

  const result = await newBlog.save()
  res.status(201).json(result)
})

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const blog = await Blog.findById(req.params.id)

  if (req.user !== blog.user.toString()) {
    return res.status(401).json({ error: 'you do not have permission to update this' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  res.json(updatedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (req.user !== blog.user.toString()) {
    return res.status(401).json({ error: 'you do not have permission to delete this' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogRouter