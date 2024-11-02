const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('API: retrieve blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
  })
})

describe('API: blog data format', () => {
  test('blog ID field is named \'id\'', async () => {
    const response = await helper.blogsInDb()
    response.forEach(blog => assert(('id' in blog) && !('_id' in blog)))
  })
})

describe('API: add blogs', () => {
  describe('valid blogs', () => {
    test('a valid blog can be added', async () => {
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

    test('blog without likes sets likes to zero', async () => {
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
      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })
  })

  describe('invalid blogs', () => {
    test('blog without title is not added', async () => {
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

    test('blog without url is not added', async () => {
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
})

after(async () => {
  await mongoose.connection.close()
})