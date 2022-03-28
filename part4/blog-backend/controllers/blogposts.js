const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");

blogPostsRouter.get("/", async (request, response) => {
  const blogs = await BlogPost.find({});
  response.json(blogs);
});

blogPostsRouter.get("/:id", async (request, response) => {
  const blogpost = await BlogPost.findById(request.params.id);
  
  if (blogpost) {
    return response.json(blogpost);
  } else {
    return response.status(404).end();
  }
});

blogPostsRouter.post("/", async (request, response) => {
  const blogPost = new BlogPost(request.body);
  const savedBlogPost = await blogPost.save();
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
    likes: body.likes
  };

  const updatedBlogPost = await BlogPost.findByIdAndUpdate(request.params.id, blogPost, { new: true })
  return response.status(200).json(updatedBlogPost);

});

module.exports = blogPostsRouter;