const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category } = require("../models");
const { arts, users, categories } = require("./data/data");
const { deleteImage } = require("../helpers");

Chai.use(chaiHttp);

let userData, categoriesData, image_url, artId;

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
      .field("categories", `${categories[0]._id}, ${categories[1]._id}`)
      .attach("image_url", fs.readFileSync(art.image_url), art.image_name)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body);
      });
  });
};

describe("Get /arts", () => {
  before((done) => {
    Category.insertMany(categories)
      .then((data) => {
        categoriesData = data;
        return registerUser(users[0]);
      })
      .then(() => {
        return loginUser(users[0]);
      })
      .then((res) => {
        userData = res;
        return createArts(arts[0], userData, categoriesData);
      })
      .then((res) => {
        image_url = res.image_url;
        artId = res._id;
        done();
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

  describe("succes case get", () => {
    it("should return response with status code 200 when get all arts", (done) => {
      Chai.request(app)
        .get("/arts")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.have.property("_id");
          expect(res.body[0]).to.have.property("user");
          expect(res.body[0]).to.have.property("title");
          expect(res.body[0]).to.have.property("image_url");
          expect(res.body[0]).to.have.property("price");
          expect(res.body[0]).to.have.property("likes");
          expect(res.body[0]).to.have.property("categories");
          done();
        });
    });

    it("should return response with status code 200 when get one arts", (done) => {
      Chai.request(app)
        .get(`/arts/${artId}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("user");
          expect(res.body.user).to.be.an("object");
          expect(res.body).to.have.property("title");
          expect(res.body).to.have.property("image_url");
          expect(res.body).to.have.property("price");
          expect(res.body).to.have.property("likes");
          expect(res.body).to.have.property("categories");
          expect(res.body.categories).to.be.an("array");
          done();
        });
    });
  });
});
