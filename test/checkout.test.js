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

describe("Post /transaction", () => {
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
    it("should return response with status code 201", (done) => {
      Chai.request(app)
        .post("/transaction")
        .set("access_token", userData.access_token)
        .send(transactions[0])
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("transactionToken");
          expect(res.body).to.have.property("clientKey");
          expect(res.body).to.have.property("transactionId");
          done();
        });
    });
  });

  describe("failed case, with 400 status code", () => {
    const tests = [
      {
        args: {
          ...transactions[0],
          arts: [{ ...transactions[0].arts[0], id: null }],
        },
        expected: {
          field: "id",
          type: "null",
          message:
            "Transaction validation failed: arts.0.id: Path `id` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [{ ...transactions[0].arts[0], item: null }],
        },
        expected: {
          field: "item",
          type: "null",
          message: "Path `item` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [{ ...transactions[0].arts[0], size: null }],
        },
        expected: {
          field: "size",
          type: "null",
          message: "Path `size` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [{ ...transactions[0].arts[0], color: null }],
        },
        expected: {
          field: "color",
          type: "null",
          message: "Path `color` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [
            {
              ...transactions[0].arts[0],
              position: { ...transactions[0].arts[0].position, left: null },
            },
          ],
        },
        expected: {
          field: "position",
          type: "null",
          message: "Path `position.left` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [
            {
              ...transactions[0].arts[0],
              position: { ...transactions[0].arts[0].position, top: null },
            },
          ],
        },
        expected: {
          field: "position",
          type: "null",
          message: "Path `position.top` is required.",
        },
      },
      {
        args: {
          ...transactions[0],
          arts: [{ ...transactions[0].arts[0], quantity: null }],
        },
        expected: {
          field: "quantity",
          type: "null",
          message: "Path `quantity` is required.",
        },
      },
      {
        args: { ...transactions[0], gross_amount: null },
        expected: {
          field: "gross_amount",
          type: "null",
          message:
            "Transaction validation failed: gross_amount: Path `gross_amount` is required.",
        },
      },

      {
        args: { ...transactions[0], address: null },
        expected: {
          field: "address",
          type: "null",
          message:
            "Transaction validation failed: address: Path `address` is required.",
        },
      },
    ];

    tests.forEach(({ args, expected }) => {
      it(`should return error when ${expected.field} is ${expected.type}`, function (done) {
        Chai.request(app)
          .post("/transaction")
          .set("access_token", userData.access_token)
          .send(args)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.contain(expected.message);
            done();
          });
      });
    });
  });

  describe("failed case, with 401 status code", () => {
    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .post("/transaction")
        .send(transactions[0])
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
