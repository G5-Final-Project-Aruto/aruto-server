const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");

const app = require("../app");
const { User } = require("../models");

Chai.use(chaiHttp);

let registerUserTest = {
  full_name: "admin",
  username: "admin",
  email: "admiin@gmail.com",
  password: 123456,
};

describe("Post /register", () => {
  after((done) => {
    User.deleteMany({})
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 201", (done) => {
      Chai.request(app)
        .post("/register")
        .set("content-type", "application/x-www-form-urlencoded")
        .send(registerUserTest)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("full_name");
          expect(res.body.full_name).to.equal(registerUserTest.full_name);
          expect(res.body).to.have.property("username");
          expect(res.body.username).to.equal(registerUserTest.username);
          expect(res.body).to.have.property("email");
          expect(res.body.email).to.equal(registerUserTest.email);
          done();
        });
    });
  });

  describe("failed case, with 400 status code", () => {
    const tests = [
      {
        args: { ...registerUserTest, full_name: "" },
        expected: {
          field: "full_name",
          type: "null",
          message:
            "User validation failed: full_name: Path `full_name` is required.",
        },
      },
      {
        args: { ...registerUserTest, username: "" },
        expected: {
          field: "username",
          type: "null",
          message:
            "User validation failed: username: Path `username` is required.",
        },
      },
      {
        args: { ...registerUserTest, email: "" },
        expected: {
          field: "email",
          type: "null",
          message: "User validation failed: email: Path `email` is required.",
        },
      },
      {
        args: { ...registerUserTest, password: "" },
        expected: {
          field: "password",
          type: "null",
          message:
            "User validation failed: password: Path `password` is required.",
        },
      },
      {
        args: registerUserTest,
        expected: {
          field: "email",
          type: "not unique",
          message: "email is unique",
        },
      },
    ];

    tests.forEach(({ args, expected }) => {
      it(`should return error when ${expected.field} is ${expected.type}`, function (done) {
        Chai.request(app)
          .post("/register")
          .set("content-type", "application/x-www-form-urlencoded")
          .send(args)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal(expected.message);
            done();
          });
      });
    });
  });
});
