const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogHelper = require('./blog_helper')
const userHelper = require('./user_helper')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when blog posts already exist and at least one user exists', () => {
  beforeEach(async () => {
    // Reinitialize users in database
    await User.deleteMany({})

    const userObjects = await Promise.all(userHelper.initialUsers.map(async user => {
      const userCopy = {
        username: user.username,
        name: user.name,
        passwordHash: await bcrypt.hash(user.password, 10)
      }

      return new User(userCopy)
    }))

    const userPromiseArray = userObjects.map(user => user.save())
    await Promise.all(userPromiseArray)

    // Reinitialize blogs in database
    await Blog.deleteMany({})
    const users = await userHelper.usersInDb()

    const blogObjects = blogHelper.initialBlogs.map(blog => {
      // Make sure every blog has a user attached to it for testing PUT and DELETE
      const blogCopy = {
        ...blog,
        user: users[0].id
      }
      return new Blog(blogCopy)
    })

    const blogPromiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(blogPromiseArray)
  })

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await blogHelper.blogsInDb()
    assert.strictEqual(response.length, blogHelper.initialBlogs.length)
  })

  test('blog ID field is named \'id\'', async () => {
    const response = await blogHelper.blogsInDb()
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

      const token = await userHelper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length + 1)

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

      const token = await userHelper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if title does not exist', async () => {
      const newBlog = {
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      const token = await userHelper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 400 if URL does not exist', async () => {
      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        likes: 8,
      }

      const token = await userHelper.getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 401 if token is invalid', async () => {
      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('update an existing blog', () => {
    test('succeeds with status code 200 if ID is valid', async () => {
      const blogs = await blogHelper.blogsInDb()
      const blogToUpdate = blogs[0]

      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      const token = await userHelper.getToken()

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogHelper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      delete updatedBlog.id
      delete updatedBlog.user
      assert.deepStrictEqual(updatedBlog, newBlog)
    })

    test('fails with status code 401 if user does not match', async () => {
      const blogs = await blogHelper.blogsInDb()
      const blogToUpdate = blogs[0]

      const newBlog = {
        title: 'Music is Awesome',
        author: 'Parker Piedmont',
        url: 'https://parkerpiedmont.com',
        likes: 8,
      }

      const token = 'fake token'

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)
    })
  })

  describe('delete an existing blog', () => {
    test('succeeds with status code 204 if ID is valid', async () => {
      const blogs = await blogHelper.blogsInDb()
      const blogToDelete = blogs[0]

      const token = await userHelper.getToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length - 1)
    })

    test('fails with status code 401 if user does not match', async () => {
      const blogs = await blogHelper.blogsInDb()
      const blogToDelete = blogs[0]

      const token = 'fake token'

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})