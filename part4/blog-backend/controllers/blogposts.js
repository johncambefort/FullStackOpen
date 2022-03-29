const jwt = require("jsonwebtoken");
const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  } else {
    return null;
  }
};

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

blogPostsRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({
      error: "token missing or invalid",
    });
  }

  const user = await User.findById(decodedToken.id);

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

blogPostsRouter.delete("/:id", async (request, response) => {
  const blogs = await BlogPost.findByIdAndRemove(request.params.id);
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
