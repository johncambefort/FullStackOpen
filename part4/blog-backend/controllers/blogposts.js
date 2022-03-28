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

// blogPostsRouter.put("/:id", async (request, response, next) => {
//   const body = request.body;

//   const contact = {
//     content: body.content,
//     important: body.important,
//   };

//   Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
//     .then((updatedContact) => {
//       response.json(updatedContact);
//     })
//     .catch((error) => next(error));
// });

module.exports = blogPostsRouter;
