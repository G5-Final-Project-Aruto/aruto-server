const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category, Transaction } = require("../models");
const { arts, users, categories, transactions } = require("./data/data");
const { deleteImage } = require("../helpers");

Chai.use(chaiHttp);

let usersData, categoriesData, artsData, transactionsData;

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

const createArts = (art, user, categories) => {
  return new Promise((resolve, reject) => {
    Chai.request(app)
      .post("/arts")
      .set("access_token", user.access_token)
      .field("title", art.title)
      .field("price", art.price)
      .field("description", art.description)
      .field("categories", `${categories[0]._id}, ${categories[1]._id}`)
      .attach("image_url", fs.readFileSync(art.image_url), art.image_name)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
  });
};

const createTransaction = (transaction, user) => {
  return new Promise((resolve, reject) => {
    Chai.request(app)
      .post("/transaction")
      .set("access_token", user.access_token)
      .send(transaction)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
  });
};

let mockNotification = {
  order_id: "",
  fraud_status: "accept",
  transaction_status: "capture",
};

describe("Post /transaction/handler", () => {
  before((done) => {
    Category.insertMany(categories)
      .then((data) => {
        categoriesData = data;
        return Promise.all([registerUser(users[0], registerUser(users[1]))]);
      })
      .then(() => {
        return Promise.all([loginUser(users[0]), loginUser(users[1])]);
      })
      .then((data) => {
        usersData = data;
        return Promise.all([
          createArts(arts[0], usersData[0], categoriesData),
          createArts(arts[1], usersData[0], categoriesData),
        ]);
      })
      .then((data) => {
        artsData = data;
        transactions[0].arts[0].id = data[0]._id;
        transactions[1].arts[0].id = data[1]._id;
        return Promise.all([
          createTransaction(transactions[0], usersData[0]),
          createTransaction(transactions[1], usersData[0]),
        ]);
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          Chai.request(app)
            .get("/transaction/history")
            .set("access_token", usersData[0].access_token)
            .end((err, res) => {
              if (err) reject(err);
              resolve(res.body);
            });
        });
      })
      .then((data) => {
        transactionsData = data;
        mockNotification = {
          ...mockNotification,
          order_id: transactionsData[0].orderId,
        };
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
      deleteImage(artsData[0].image_url),
      deleteImage(artsData[1].image_url),
    ])

      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200 and message success if response is capture / settlement", (done) => {
      Chai.request(app)
        .post("/transaction/handler")
        .send(mockNotification)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction is success");
          done();
        });
    });

    it("should return response with status code 200 and message pending if response is pending", (done) => {
      Chai.request(app)
        .post("/transaction/handler")
        .send({
          ...mockNotification,
          order_id: transactionsData[1].orderId,
          transaction_status: "pending",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction is pending");
          done();
        });
    });

    it("should return response with status code 200 and message failed if response is cancel / expire", (done) => {
      Chai.request(app)
        .post("/transaction/handler")
        .send({
          ...mockNotification,
          order_id: transactionsData[1].orderId,
          transaction_status: "cancel",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction is failed");
          done();
        });
    });
  });

  describe("failed case, with 400 status code", () => {
    it(`should return error when transaction already processed before`, function (done) {
      Chai.request(app)
        .post("/transaction/handler")
        .send({
          ...mockNotification,
          order_id: transactionsData[1].orderId,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction's status is done");
          done();
        });
    });
  });

  describe("failed case, with 401 status code", () => {
    it("should return error when response not comply the format", (done) => {
      Chai.request(app)
        .post("/transaction/handler")
        .send({
          orderId: "qwerty123646",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Unauthorize response");
          done();
        });
    });
  });

  describe("failed case, with 404 status code", () => {
    it("should return error when orderId not found", (done) => {
      Chai.request(app)
        .post("/transaction/handler")
        .send({
          ...mockNotification,
          order_id: "qwerty123456",
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Transaction is not found");
          done();
        });
    });
  });
});
