const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (_, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  const result = await blog.save()
  res.status(201).json(result)
})

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  res.json(updatedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogRouter