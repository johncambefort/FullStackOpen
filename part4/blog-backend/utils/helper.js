const BlogPost = require("../models/blogpost");
const User = require("../models/user");

const blogsInDb = async () => {
  const blogPosts = await BlogPost.find({});
  return (await blogPosts).map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return (await users).map((u) => u.toJSON());
};

module.exports = {
  blogsInDb,
  usersInDb,
};
