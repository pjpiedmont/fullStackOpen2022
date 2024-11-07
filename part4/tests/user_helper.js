const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'root',
    passwordHash: '0123456789abcdef',
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

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb
}