const mongoose = require("mongoose");
const supertest = require("supertest");
const { post } = require("../app");
const app = require("../app");
const BlogPost = require("../models/blogpost");

const api = supertest(app);

const coupleOfBlogs = [
  {
    title: "Biscuit's Supper",
    author: "Biscuit",
    url: "biscuit/supper",
    likes: 450,
  },
  {
    title: "Biscuit's week out",
    author: "Biscuit",
    url: "biscuit/week/out",
    likes: 349,
  },
];

beforeEach(async () => {
  // reset db to desired state for testing
  await BlogPost.deleteMany({});
  const blogObjects = coupleOfBlogs.map((blog) => new BlogPost(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("GET: correct number of blog posts", async () => {
  const response = await api
    .get("/api/blog")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(coupleOfBlogs.length);
});

test("id is defined", async () => {
  const response = await api
    .get("/api/blog/")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const bps = response.body[0];

  expect(bps.id).toBeDefined();
});

test("new blogs are created", async () => {
  const newPost = {
    title: "Another one for testing",
    author: "Not Biscuit",
    url: "/another/blog/post",
    likes: 1004,
  };

  await api
    .post("/api/blog/")
    .send(newPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Get blogs in DB
  const blogsInDB = await BlogPost.find({});
  const renderedBlogsInDB = await blogsInDB.map((blog) => blog.toJSON());

  expect(renderedBlogsInDB.length).toBe(coupleOfBlogs.length + 1);

  const titles = renderedBlogsInDB.map((blog) => blog.title);
  expect(titles).toContain("Another one for testing");
});

test("likes defaults to 0 if missing", async () => {
  const blogPostWithNoLikes = {
    title: "This post wasn't very popular",
    author: "Not Biscuit either",
    url: "url/without/likes",
  };

  const response = await api
    .post("/api/blog")
    .send(blogPostWithNoLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const savedBlog = await api
    .get(`/api/blog/${response.body.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(savedBlog.body.likes).toBeDefined();
  expect(savedBlog.body.likes).toEqual(0);
});

test("backend error 400 if title or url are missing", async () => {
  const blogPosts = [
    {
      title: "Test1",
      author: "Coolio",
      likes: 193,
    },
    {
      author: "Somedude",
      url: "/some/dude",
      likes: 392,
    },
  ];

  const promiseArray = blogPosts.map(async (blog) => {
    await api
      .post("/api/blog/")
      .send(blog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  await Promise.all(promiseArray);
});

test("deleting a blog post works", async () => {
  const tempBlogPost = {
    title: "To be deleted",
    author: "nobody",
    url: "Not Biscuit",
  };

  const response = await api
    .post("/api/blog/")
    .send(tempBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  console.log(response.body);

  await api
    .delete(`/api/blog/${response.body.id}`)
    .expect(204);

  const isInDb = await BlogPost.find({title: "To be deleted"});
  expect(isInDb).toHaveLength(0);
});

afterAll(() => {
  mongoose.connection.close();
});
