const mongoose = require("mongoose");
const supertest = require("supertest");
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
  console.log(bps);

  expect(bps.id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
