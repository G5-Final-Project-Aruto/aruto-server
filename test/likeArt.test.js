const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");
const fs = require("fs");

const app = require("../app");
const { Art, User, Category } = require("../models");
const { arts, users, categories } = require("./data/data");
const { deleteImage, getToken } = require("../helpers");

Chai.use(chaiHttp);

let usersData, categoriesData, artsCreated;

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

const ilegalUser = () => {
  return getToken({
    username: "inzaghi",
  });
};

const ilegalUserIdEmail = () => {
  return getToken({
    _id: `qwerty123456`,
    username: "syahrialrangga11@gmail.com",
  });
};

describe("Put /arts", () => {
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
        artsCreated = res;
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    Category.deleteMany({})
      .then(() => User.deleteMany({}))
      .then(() => Art.deleteMany({}))
      .then(() =>
        Promise.all([
          deleteImage(artsCreated[0].image_url),
          deleteImage(artsCreated[1].image_url),
        ])
      )
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200 when success like art", (done) => {
      Chai.request(app)
        .patch(`/arts/${artsCreated[0]._id}/like`)
        .set("access_token", usersData[0].access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Art has been liked");
          done();
        });
    });

    it("should return response with status code 200 when success dislike art", (done) => {
      Chai.request(app)
        .patch(`/arts/${artsCreated[0]._id}/like`)
        .set("access_token", usersData[0].access_token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Art has been disliked");
          done();
        });
    });
  });

  describe("failed case with status code 401", () => {
    it("should return error when access_token is null", (done) => {
      Chai.request(app)
        .patch(`/arts/${artsCreated[0]._id}/like`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Please login first");
          done();
        });
    });

    it("should return error when user data not found in database", (done) => {
      Chai.request(app)
        .patch(`/arts/${artsCreated[0]._id}/like`)
        .set("access_token", ilegalUser())
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Invalid token");
          done();
        });
    });

    it("should return error when user data's email is wrong", (done) => {
      Chai.request(app)
        .patch(`/arts/${artsCreated[0]._id}/like`)
        .set("access_token", ilegalUserIdEmail())
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Invalid token");
          done();
        });
    });
  });
});
