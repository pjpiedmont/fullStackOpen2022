const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when blog posts already exist', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })

  test('blog ID field is named \'id\'', async () => {
    const response = await helper.blogsInDb()
    response.forEach(blog => assert(('id' in blog) && !('_id' in blog)))
  })

  describe('add a new blog', () => {
    test('succeeds with status code 201 if data is valid', async () => {
      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      const authors = blogsAtEnd.map(blog => blog.author)
      const urls = blogsAtEnd.map(blog => blog.url)

      assert(titles.includes(newBlog.title))
      assert(authors.includes(newBlog.author))
      assert(urls.includes(newBlog.url))
    })

    test('succeeds with status code 201 if missing likes and sets likes to zero', async () => {
      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if title does not exist', async () => {
      const newBlog = {
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 400 if URL does not exist', async () => {
      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        likes: 8,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('update an existing blog', () => {
    test('succeeds with status code 200 if ID is valid', async () => {
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0]

      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      delete updatedBlog.id
      assert.deepStrictEqual(updatedBlog, newBlog)
    })
  })

  describe('delete an existing blog', () => {
    test('succeeds with status code 204 if ID is valid', async () => {
      const blogs = await helper.blogsInDb()
      const blogToDelete = blogs[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})