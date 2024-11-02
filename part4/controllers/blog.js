const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (_, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => next(err))
})

module.exports = blogRouter