const request = require('supertest')

const app = require('../app')

const { admin_token } = require('./token')

let art = {
  image_url: './test/image/gambar.jpg',
  price: 20000,
  like_count: 0
}

describe('Testing POST /arts', () => {
  afterAll((done) => {
    let container = []
    request(app)
      .get("/arts")
      .set("access_token", admin_token)
      .end((err, res) => {
        container = res.body
      });
    container.forEach((el) => {
      request(app)
        .delete(`/products/${el._id}`)
        .set("access_token", admin_token)
        .end(() => done())
    })
  })
  describe("succes case 201", () => {
    it("should return status code 201", (done) => {
      request(app)
        .post('/arts')
        .set("access_token", admin_token)
        .field('price', art.price)
        .field('like_count', art.like_count)
        .attach('fileTest', art.image_url)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("string")
            expect(res.body).toHaveProperty("image_url")
            expect(typeof res.body.image_url).toEqual("string")
            expect(res.body).toHaveProperty("price", art.price)
            expect(res.body).toHaveProperty("like_count", art.like_count)
            done()
          }
        })
    })
  })
  describe("failed case with status code 401", () => {
    it("should return error when not passed access_token", (done) => {
      request(app)
        .post("/arts")
        .field('price', art.price)
        .field('like_count', art.like_count)
        .attach('fileTest', art.image_url)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.statusCode).toEqual(401);
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
  ])("failed case with status code 400", (attribute, testCase, input, expected) => {
    it(`should return message '${expected}' when ${attribute} is '${testCase}'`, (done) => {
      request(app)
        .post("/arts")
        .set("access_token", admin_token)
        .field('price', art.price)
        .field('like_count', art.like_count)
        .attach('fileTest', art.image_url)
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
    });
  })
  describe("failed case with status code 400", () => {
    it("should return 'Image is required' when image not attached", (done) => {
      request(app)
        .post('/arts')
        .set("access_token", admin_token)
        .field('price', art.price)
        .field('like_count', art.like_count)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("string")
            expect(res.body).toHaveProperty("image_url")
            expect(typeof res.body.image_url).toEqual("string")
            expect(res.body).toHaveProperty("price", product.price)
            expect(res.body).toHaveProperty("like_count", product.like_count)
            done();
          }
        })
    })
  })
})