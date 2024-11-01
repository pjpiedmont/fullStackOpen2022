const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}