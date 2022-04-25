const mongoose = require("mongoose");
const supertest = require("supertest");
const { post } = require("../app");
const app = require("../app");
const BlogPost = require("../models/blogpost");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("../utils/helper");

const api = supertest(app);

describe("blog post backend tests", () => {
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

    await api.delete(`/api/blog/${response.body.id}`).expect(204);

    const isInDb = await BlogPost.find({ title: "To be deleted" });
    expect(isInDb).toHaveLength(0);
  });

  test("updating a blog post works", async () => {
    const blogsInDb = await BlogPost.find({});
    const renderedBlogsInDB = await blogsInDb.map((blog) => blog.toJSON());
    const firstBlogPostId = renderedBlogsInDB[0].id;

    await api
      .put(`/api/blog/${firstBlogPostId}`)
      .send({
        title: "Biscuit's Update",
        author: "Biscuit's Child",
        url: "/biscuit/child/update",
        likes: 10497,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const isInDb = await BlogPost.find({ title: "Biscuit's Update" });
    expect(isInDb).not.toHaveLength(0);
  });
});

describe("user auth: 1 user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({
      username: "root",
      name: "SuperUser",
      passwordHash,
    });

    await user.save();
  });

  test("creation works with original username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "bct",
      name: "Biscuit",
      password: "treats",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = (await usersAtEnd).map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("if username already exists, creation fails properly", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "rootpwd",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("username and password are required", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserWithoutUsername = {
      name: "biscuitsdog",
      password: "anotherPwd",
    };

    const responseNoUsername = await api
      .post("/api/users")
      .send(newUserWithoutUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(responseNoUsername.body.error).toContain(
      "Path `username` is required"
    );

    const newUserWithoutPassword = {
      username: "someFella",
    };
    const responseNoPassword = await api
      .post("/api/users")
      .send(newUserWithoutPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(responseNoPassword.body.error).toContain(
      "password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
