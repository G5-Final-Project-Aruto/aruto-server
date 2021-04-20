const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category, Transaction } = require("../models");
const { arts, users, categories, transactions } = require("./data/data");
const { deleteImage } = require("../helpers");

Chai.use(chaiHttp);

let userData, categoriesData, artData;

describe("Post /transaction/history", () => {
  before((done) => {
    Category.insertMany(categories)
      .then((data) => {
        categoriesData = data;
        return new Promise((resolve, reject) => {
          Chai.request(app)
            .post("/register")
            .send({ ...users[0] })
            .end((err, res) => {
              if (err) reject(err);
              resolve(res.body);
            });
        });
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          Chai.request(app)
            .post("/login")
            .send({
              email: users[0].email,
              password: users[0].password,
            })
            .end((err, res) => {
              if (err) reject(err);
              resolve(res.body);
            });
        });
      })
      .then((data) => {
        userData = data;
        return new Promise((resolve, reject) => {
          Chai.request(app)
            .post("/arts")
            .set("access_token", userData.access_token)
            .field("title", arts[0].title)
            .field("price", arts[0].price)
            .field("description", arts[0].description)
            .field(
              "categories",
              `${categoriesData[0]._id}, ${categoriesData[1]._id}`
            )
            .attach(
              "image_url",
              fs.readFileSync(arts[0].image_url),
              arts[0].image_name
            )
            .end((err, res) => {
              if (err) reject(err);
              resolve(res.body);
            });
        });
      })
      .then((data) => {
        artData = data;
        transactions[0].arts[0].id = data._id;
        return new Promise((resolve, reject) => {
          Chai.request(app)
            .post("/transaction")
            .set("access_token", userData.access_token)
            .send(transactions[0])
            .end((err, res) => {
              if (err) reject(err);
              resolve(res.body);
            });
        });
      })
      .then((data) => {
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    Promise.all([
      Category.deleteMany({}),
      User.deleteMany({}),
      Art.deleteMany({}),
      Transaction.deleteMany({}),
      deleteImage(artData.image_url),
    ])
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200", (done) => {
      Chai.request(app)
        .get("/transaction/history")
        .set("access_token", userData.access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.have.property("_id");
          expect(res.body[0]).to.have.property("arts");
          expect(res.body[0].arts).to.be.an("array");
          expect(res.body[0]).to.have.property("gross_amount");
          expect(res.body[0]).to.have.property("address");
          expect(res.body[0]).to.have.property("status");
          expect(res.body[0]).to.have.property("UserId");
          expect(res.body[0].UserId).to.be.equal(userData._id);
          done();
        });
    });
  });

  describe("failed case, with 401 status code", () => {
    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .get("/transaction/history")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.contain("Please login first");
          done();
        });
    });
  });
});
