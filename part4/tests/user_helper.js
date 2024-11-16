const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialUsers = [
  {
    username: 'root',
    name: 'root',
    password: 'password1!',
  },
]

// Generates an ID that points to a blog post that no longer exists
const nonExistingId = async () => {
  const user = new User({
    username: 'deleteMe',
    name: 'Doesn\'t Matter',
    passwordHash: '0123456789abcdef',
  })

  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getToken = async () => {
  const username = initialUsers[0].username
  const user = await User.findOne({ username })
  const userForToken = {
    username: username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  return token
}

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
  getToken
}