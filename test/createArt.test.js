const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category } = require("../models");
const { arts, users, categories } = require("./data/data");
const { deleteImage } = require("../helpers");

Chai.use(chaiHttp);

let userData, categoriesData, image_url;

describe("Post /arts", () => {
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
        Chai.request(app)
          .post("/login")
          .send({
            email: users[0].email,
            password: users[0].password,
          })
          .end((err, res) => {
            if (err) throw err;
            userData = res.body;
            done();
          });
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    Category.deleteMany({})
      .then(() => User.deleteMany({}))
      .then(() => Art.deleteMany({}))
      .then(() => deleteImage(image_url))
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 201", (done) => {
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
          image_url = res.body.image_url;
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("user");
          expect(res.body).to.have.property("title");
          expect(res.body).to.have.property("image_url");
          expect(res.body).to.have.property("price");
          expect(res.body).to.have.property("likes");
          expect(res.body).to.have.property("categories");
          expect(res.body).to.have.property("description");
          done();
        });
    });
  });

  describe("failed case, with 400 status code", () => {
    it("should return error when title is null", (done) => {
      Chai.request(app)
        .post("/arts")
        .set("access_token", userData.access_token)
        .field("title", "")
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
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            "Art validation failed: title: Path `title` is required."
          );
          done();
        });
    });

    it("should return error when price is 0", (done) => {
      Chai.request(app)
        .post("/arts")
        .set("access_token", userData.access_token)
        .field("title", arts[0].title)
        .field("price", "")
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
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.contain("Price is required");
          done();
        });
    });

    it("should return error when categories is null", (done) => {
      Chai.request(app)
        .post("/arts")
        .set("access_token", userData.access_token)
        .field("title", arts[0].title)
        .field("price", arts[0].price)
        .field("description", arts[0].description)
        .field("categories", "")
        .attach(
          "image_url",
          fs.readFileSync(arts[0].image_url),
          arts[0].image_name
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            `Art validation failed: categories.0: Cast to [ObjectId] failed for value "[""]" at path "categories.0"`
          );
          done();
        });
    });

    it("should return error when image_url is null", (done) => {
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
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Image is required");
          done();
        });
    });

    it("should return error when image uploaded is not on jpg / png format", (done) => {
      Chai.request(app)
        .post("/arts")
        .set("access_token", userData.access_token)
        .field("title", arts[0].title)
        .field("price", arts[0].price)
        .field("description", arts[0].description)
        .attach(
          "image_url",
          fs.readFileSync("./test/data/instagram.svg"),
          "instagram.svg"
        )
        .field(
          "categories",
          `${categoriesData[0]._id}, ${categoriesData[1]._id}`
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Uploaded file must be image");
          done();
        });
    });

    it("should return error when description is null", (done) => {
      Chai.request(app)
        .post("/arts")
        .set("access_token", userData.access_token)
        .field("title", arts[0].title)
        .field("price", arts[0].price)
        .field("description", "")
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
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal(
            "Art validation failed: description: Path `description` is required."
          );
          done();
        });
    });
  });

  describe("failed case, with 401 status code", () => {
    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .post("/arts")
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
