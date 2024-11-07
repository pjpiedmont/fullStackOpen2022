const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./user_helper')
const app = require('../app')

const api = supertest(app)

describe('when at least one user is in the DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  test('users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await helper.usersInDb()
    assert.strictEqual(response.length, helper.initialUsers.length)
  })

  test('user ID field is named \'id\'', async () => {
    const response = await helper.usersInDb()
    response.forEach(user => assert(('id' in user) && !('_id' in user)))
  })

  describe('add a new user', () => {
    test('succeeds with status code 201 if data is valid', async () => {
      const newUser = {
        username: 'user1',
        name: 'User',
        password: 'password1!'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails with status code 400 if username does not exist', async () => {
      const newUser = {
        name: 'user',
        password: 'password1!'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('fails with status code 400 if username is too short', async () => {
      const newUser = {
        username: 'u',
        name: 'user',
        password: 'password1!'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('fails with status code 400 if password does not exist', async () => {
      const newUser = {
        username: 'user',
        name: 'user',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('fails with status code 400 if password is too short', async () => {
      const newUser = {
        username: 'user',
        name: 'user',
        password: 'p!'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
  })
})

after(async() => {
  await mongoose.connection.close()
})