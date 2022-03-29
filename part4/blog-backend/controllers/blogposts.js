const jwt = require("jsonwebtoken");
const { isBuffer } = require("lodash");
const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogPostsRouter.get("/", async (request, response) => {
  const blogs = await BlogPost.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogPostsRouter.get("/:id", async (request, response) => {
  const blogpost = await BlogPost.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });

  if (blogpost) {
    return response.json(blogpost);
  } else {
    return response.status(404).end();
  }
});

blogPostsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  const body = request.body;

  if (!user) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const blogPost = await new BlogPost({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlogPost = await blogPost.save();
  user.blogs = user.blogs.concat(savedBlogPost._id);
  await user.save();

  return response.status(201).json(savedBlogPost);
});

blogPostsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blogToDeleteId = request.params.id;
  const userRequestingDelete = request.user;

  if(!userRequestingDelete) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const blogToDelete = await BlogPost.findById(blogToDeleteId);

  if (blogToDelete.user.toString() !== userRequestingDelete._id.toString()) {
    return response.status(401).json({
      error: "you must be the blog post's author to delete it",
    });
  }

  // remove the blog post if all authorization checks passed
  await BlogPost.deleteOne(blogToDelete);

  return response.status(204).end();
});

blogPostsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blogPost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlogPost = await BlogPost.findByIdAndUpdate(
    request.params.id,
    blogPost,
    { new: true }
  );
  return response.status(200).json(updatedBlogPost);
});

module.exports = blogPostsRouter;
