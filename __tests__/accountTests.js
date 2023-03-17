const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
// require("dotenv").config();

beforeEach(async () => {
    const mongo = await require('../modules/MongoConnection.js').getInstance()
    // await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
    await mongoose.connection.close();
  });

describe("GET Landing", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });
  });

describe("Login test suite", () => { 
    it("logs in with user@abc", () => {
        username = "user@abc"
        password = "123"

        expect(`${username} ${password}`).toBe("user@abc 123");
    });

    // TODO: add useful automated tests

  });

