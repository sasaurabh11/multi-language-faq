import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import Faq from "../models/faq.model.js";
import redisClient from "../services/redis.client.js";

describe("FAQ API Tests", function () {
  this.timeout(50000);

  before(async function () {
    await Faq.deleteMany({});
    const cacheKeys = await redisClient.keys("faqs:*");
    if (cacheKeys.length) await redisClient.del(cacheKeys);
  });

  after(async function () {
    this.timeout(5000);
    await mongoose.connection.close();
    await redisClient.quit();
  });

  describe("POST /api/faqs", () => {
    it("creates a new FAQ", async () => {
      const faqData = { question: "How does JWT work?", answer: "JWT is a compact, URL-safe means of representing claims to be transferred between two parties." };
      const res = await request(app).post("/api/faqs").send(faqData).expect(201);
      expect(res.body.message).to.equal("FAQ created");
      expect(res.body.data).to.include(faqData);
      expect(res.body.data.translations).to.exist;
    });

    it("fails when required fields are missing", async () => {
      await request(app).post("/api/faqs").send({ question: "How does JWT work?" }).expect(400);
    });
  });

  describe("GET /api/faqs", () => {
    beforeEach(async () => {
      await Faq.deleteMany({});
      await Faq.create({
        question: "What is the purpose of Node.js?",
        answer: "Node.js is used to build scalable network applications.",
        translations: { question: new Map([["hi", "Node.js का उद्देश्य क्या है?"]]), answer: new Map([["hi", "Node.js का उपयोग स्केलेबल नेटवर्क एप्लिकेशन बनाने के लिए किया जाता है।"]]) },
      });
    });

    it("retrieves FAQs in default language", async () => {
      const res = await request(app).get("/api/faqs").expect(200);
      expect(res.body).to.be.an("array").that.is.not.empty;
      expect(res.body[0]).to.include({ question: "What is the purpose of Node.js?", answer: "Node.js is used to build scalable network applications." });
    });

    it("retrieves FAQs in specified language", async () => {
      const res = await request(app).get("/api/faqs?lang=hi").expect(200);
      expect(res.body[0]).to.include({ question: "Node.js का उद्देश्य क्या है?", answer: "Node.js का उपयोग स्केलेबल नेटवर्क एप्लिकेशन बनाने के लिए किया जाता है।" });
    });

    it("returns cached results on subsequent requests", async () => {
      await request(app).get("/api/faqs").expect(200);
      const start = Date.now();
      await request(app).get("/api/faqs").expect(200);
      expect(Date.now() - start).to.be.lessThan(50);
    });
  });
});
