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
  const blogsInDB = await (
    await BlogPost.find({})
  ).map((blog) => blog.toJSON());

  console.log(blogsInDB);
  expect(blogsInDB.length).toBe(coupleOfBlogs.length + 1);

  const titles = blogsInDB.map((blog) => blog.title);
  expect(titles).toContain("Another one for testing");
});

afterAll(() => {
  mongoose.connection.close();
});
