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

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  // Group blog posts by author
  const groupedBlogs = _.groupBy(blogs, 'author')

  // Compute sum of likes across all blog posts for each author
  const numLikes = Object.keys(groupedBlogs).map(author => {
    const blogList = groupedBlogs[author]
    const totalLikes = _.sumBy(blogList, 'likes')
    return { author: author, likes: totalLikes }
  })

  // Find the object where the 'likes' key has the highest value
  const maxLikes = _.maxBy(numLikes, 'likes')

  return maxLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}