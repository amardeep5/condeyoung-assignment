// process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("./app.js");
const conn = require("./db/server.js");

describe("POST /translate", () => {
  before((done) => {
    conn
      .connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });
  it("OK, Translating and creating a new entry in database works", (done) => {
    request(app)
      .post("/translate")
      .send({ text: "hell", to: "ko" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("translated");
        expect(body).to.contain.property("original");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Fail, It requires text", (done) => {
    request(app)
      .post("/translate")
      .send({ to: "ko" })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property("error");
        done();
      })
      .catch((err) => done(err));
  });
});
