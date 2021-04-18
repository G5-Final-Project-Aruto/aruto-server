const Chai = require("chai");
const { expect } = Chai;
const chaiHttp = require("chai-http");

const app = require("../app");
const { Category } = require("../models");
const { categories } = require("./data/data");

Chai.use(chaiHttp);

describe("Get /categories", () => {
  before((done) => {
    Category.insertMany(categories)
      .then(() => done())
      .catch((err) => console.log(err));
  });

  after((done) => {
    Category.deleteMany({})
      .then(() => done())
      .catch((err) => console.log(err));
  });

  describe("succes case", () => {
    it("should return response with status code 200", (done) => {
      Chai.request(app)
        .get("/categories")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.have.property("_id");
          expect(res.body[0]).to.have.property("title");
          expect(res.body[0]).to.have.property("image_url");
          done();
        });
    });
  });
});
