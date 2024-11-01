const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, current) => {
    if (current.likes > favorite.likes) {
      favorite = current
    }

    return favorite
  }, blogs[0])
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const numBlogs = _.countBy(blogs, 'author')

  const maxBlogs = Object.keys(numBlogs).reduce((max, curr) => {
    if (numBlogs[curr] > numBlogs[max]) {
      max = curr
    }

    return max
  })

  const mostProlificAuthor = {
    author: maxBlogs,
    blogs: numBlogs[maxBlogs]
  }

  return mostProlificAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}