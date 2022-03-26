const blogPostsRouter = require("express").Router();
const BlogPost = require("../models/blogpost");

blogPostsRouter.get("/", async (request, response) => {
  BlogPost.find({}).then((blogpost) => {
    response.json(blogpost);
  });
});

blogPostsRouter.get("/:id", async (request, response, next) => {
  BlogPost.findById(request.params.id)
    .then((blogpost) => {
      if (blogpost) {
        response.json(blogpost);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogPostsRouter.post("/", async (request, response, next) => {
  const blogPost = new BlogPost(request.body);
  const savedBlogPost = await blogPost.save();
  response.status(201).json(savedBlogPost);
});

blogPostsRouter.delete("/:id", async (request, response, next) => {
  BlogPost.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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
