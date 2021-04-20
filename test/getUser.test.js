const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { User } = require("../models");
const { users } = require("./data/data");

Chai.use(chaiHttp);

let usersData;

const registerUser = (user) => {
  return new Promise((resolve, reject) => {
    Chai.request(app)
      .post("/register")
      .send({ ...user })
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
  });
};

const loginUser = (user) => {
  return new Promise((resolve, reject) => {
    Chai.request(app)
      .post("/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
  });
};

describe("Post /arts", () => {
  before((done) => {
    Promise.all([registerUser(users[0]), registerUser(users[1])]).then(() =>
      Promise.all([loginUser(users[0]), loginUser(users[1])])
        .then((data) => {
          usersData = data;
          done();
        })
        .catch((err) => console.log(err))
    );
  });

  after((done) => {
    User.deleteMany({})
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200", (done) => {
      Chai.request(app)
        .get("/user")
        .set("access_token", usersData[0].access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("username");
          expect(res.body).to.have.property("full_name");
          expect(res.body).to.have.property("arts");
          expect(res.body.arts).to.be.an("array");
          expect(res.body).not.to.have.property("password");
          done();
        });
    });
  });

  describe("failed case, with 401 status code", () => {
    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .get("/user")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Please login first");
          done();
        });
    });
  });
});
