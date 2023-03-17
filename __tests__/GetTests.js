const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

const Items = require("../models/Items");

beforeAll(async () => {
  const mongo = await require('../modules/MongoConnection.js').getInstance()
  // await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// 200 = successful connection
// 302 = redirect (mostly for pages that require login)

describe("Get Landing, /", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });
  });

describe("Get Home, /home", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/home");
      expect(res.statusCode).toBe(302);
    });
  });

describe("Get Login, /login", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/login");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Get Item Listing, /itemListing", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/itemListing");
      expect(res.statusCode).toBe(302);
    });
  });

describe("Get Register, /register", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/register");
      expect(res.statusCode).toBe(200);
    });
  });

describe("Get Create Item, /createItem", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/createItem");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("Get Profile, /profile", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/profile");
      expect(res.statusCode).toBe(200);
    });
  });

describe("Get Friends, /friends", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/friends");
      expect(res.statusCode).toBe(302);
    });
  });

describe("Get Edit Profile, /editProfile", () => {
    it("Return Status 200", async () => {
      const res = await request(app).get("/editProfile");
      expect(res.statusCode).toBe(200);
    });
  });

describe("Get Item Page, /item/:item_id", () => {
    it("Return Status 200", async () => {
      const item_id = await Items.findOne().lean()
      const res = await request(app).get("/item/"+item_id._id);
      expect(res.statusCode).toBe(200);
    });
  });

describe("Get Item Purchase Page, /item/:item_id/purchase", () => {
    it("Return Status 200", async () => {
      const item_id = await Items.findOne().lean()
      const res = await request(app).get("/item/"+item_id._id+"/purchase");
      expect(res.statusCode).toBe(200);
    });
  });

