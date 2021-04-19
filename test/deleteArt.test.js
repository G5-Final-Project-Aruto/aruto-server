const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category } = require("../models");
const { arts, users, categories } = require("./data/data");
const { deleteImage } = require("../helpers");

Chai.use(chaiHttp);

let usersData, categoriesData, image_urls, artIds;

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

describe("Delete /arts", () => {
  before((done) => {
    Category.insertMany(categories)
      .then((data) => {
        categoriesData = data;
        return Promise.all([registerUser(users[0]), registerUser(users[1])]);
      })
      .then(() => {
        return Promise.all([loginUser(users[0]), loginUser(users[1])]);
      })
      .then((res) => {
        usersData = res;
        return Promise.all([
          createArts(arts[0], usersData[0], categoriesData),
          createArts(arts[1], usersData[0], categoriesData),
        ]);
      })
      .then((res) => {
        image_urls = res.map((art) => art.image_url);
        artIds = res.map((art) => art._id);
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    Category.deleteMany({})
      .then(() => User.deleteMany({}))
      .then(() => Art.deleteMany({}))
      .then(() =>
        Promise.all([deleteImage(image_urls[0]), deleteImage(image_urls[1])])
      )
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200 when success delete art", (done) => {
      Chai.request(app)
        .delete(`/arts/${artIds[0]}`)
        .set("access_token", usersData[0].access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Art deleted succesfully");
          done();
        });
    });
  });

  describe("failed case with status code 401", () => {
    it("should return error when different user try to delete other user art", (done) => {
      Chai.request(app)
        .delete(`/arts/${artIds[1]}`)
        .set("access_token", usersData[1].access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Unauthorize user");
          done();
        });
    });

    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .delete(`/arts/${artIds[1]}`)
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
