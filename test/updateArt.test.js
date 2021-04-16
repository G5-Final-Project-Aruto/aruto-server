const request = require('supertest')

const { admin_token } = require('./token')

const app = require('../app')

let createArt = {
  image_url: './test/image/gambar.jpg',
  price: 20000,
  like_count: 0
}

let updateArt = {
  image_url: './test/image/gambar.jpg',
  price: 50000,
  like_count: 0
}

let artId = '',
latestUrl =''

describe("testing PUT /arts", () => {
  beforeAll((done) => {
    request(app)
      .post("/arts")
      .set("access_token", admin_token)
      .field("price", createArt.price)
      .field("like_count", createArt.like_count)
      .attach("fileTest", createArt.image_url)
      .end((err, res) => {
        artId = res.body._id
        latestUrl = res.body.image_url
        done();
      });
  })

  afterAll((done) => {
    let container = [];
    request(app)
      .get("/arts")
      .set("access_token", admin_token)
      .end((err, res) => {
        container = res.body;
      })
    container.forEach((el) => {
      request(app)
        .delete(`/arts/${el._id}`)
        .set("access_token", admin_token)
        .end(() => done())
    })
  })
  describe("success case with status code 200", () => {
    it("should return updated value (when not attach file)", (done) => {
      request(app)
        .put(`/arts/${artId}`)
        .set("access_token", admin_token)
        .field("price", updateArt.price)
        .field("like_count", updateArt.like_count)
        .field("latestUrl", latestUrl)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.statusCode).toEqual(200)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("number")
            expect(res.body).toHaveProperty("image_url", latestUrl)
            expect(res.body).toHaveProperty("price", updateArt.price)
            expect(res.body).toHaveProperty("like_count", updateArt.like_count)
            done()
          }
        })
    })
    it("should return updated value (when not attach file)", (done) => {
      request(app)
        .put(`/arts/${artId}`)
        .set("access_token", admin_token)
        .field("price", updateArt.price)
        .field("like_count", updateArt.like_count)
        .field("latestUrl", latestUrl)
        .attach("fileTest", updateArt.image_url)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.statusCode).toEqual(200)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("number")
            expect(res.body).toHaveProperty("image_url", latestUrl)
            expect(res.body).toHaveProperty("price", updateArt.price)
            expect(res.body).toHaveProperty("like_count", updateArt.like_count)
            done()
          }
        })
    })
  })
  describe("failed case with status code 401", () => {
    it("should return error when not passed access_token", (done) => {
      request(app)
        .put(`/arts/${artId}`)
        .field("price", updateArt.price)
        .field("like_count", updateArt.like_count)
        .attach("fileTest", updateArt.image_url)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.statusCode).toEqual(401)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("message", "Please login first")
            done()
          }
        })
    })
  })
  describe.each([
    ["price", "empty", { ...art, price: "" }, "Price is required"],
    [
      "price",
      "negative value",
      { ...art, price: -300000 },
      "Price must be greater then 0",
    ],
    [
      "like_count",
      "negative value",
      { ...art, like_count: -1 },
      "Like Count must be greater then 0",
    ],
  ])("failed case with status code 400",
    (attribute, testCase, input, expected) => {
      it(`should return message '${expected}' when ${attribute} is '${testCase}'`, (done) => {
        request(app)
          .put(`/arts/${artId}`)
          .set("access_token", admin_token)
          .field("price", input.price)
          .field("like_count", input.like_count)
          .attach("fileTest", input.image_url)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              expect(res.statusCode).toEqual(400);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("message", `${expected}`);
              done();
            }
          });
      })
  })
})