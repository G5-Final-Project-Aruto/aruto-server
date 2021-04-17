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

describe("Post /login", () => {
  before((done) => {
    User.create(registerUserTest)
      .then(() => done())
      .catch((err) => console.log(err));
  });

  after((done) => {
    User.deleteMany({})
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200", (done) => {
      Chai.request(app)
        .post("/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          email: registerUserTest.email,
          password: registerUserTest.password,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("email");
          expect(res.body.email).to.equal(registerUserTest.email);
          expect(res.body).to.have.property("access_token");
          done();
        });
    });
  });

  describe("failed case, with 400 status code", () => {
    const tests = [
      {
        args: { email: registerUserTest.email, password: 12345 },
        expected: {
          field: "password",
          type: "wrong",
          message: "Invalid email / password",
        },
      },
      {
        args: { email: "admin2@mail.com", password: registerUserTest.password },
        expected: {
          field: "email",
          type: "wrong",
          message: "Invalid email / password",
        },
      },
    ];

    tests.forEach(({ args, expected }) => {
      it(`should return error when ${expected.field} is ${expected.type}`, function (done) {
        Chai.request(app)
          .post("/login")
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
