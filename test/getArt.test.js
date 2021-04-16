const request = require('supertest')

const { admin_token } = require('./token')

const app = require('../app')

let createArt = {
  image_url: './test/image/gambar.jpg',
  price: 20000,
  like_count: 0
}
let artId = ''

describe("testing GET /arts", () => {
  beforeAll((done) => {
    request(app)
      .post("/arts")
      .set("access_token", admin_token)
      .field("price", createArt.price)
      .field("like_count", createArt.like_count)
      .attach("fileTest", createArt.image_url)
      .end((err, res) => {
        artId = res.body._id
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
  describe("success case", ()=> {
    it("should return status code 200", (done) => {
      request(app)
        .get('/arts')
        .end((err, res) => {
          if(err){
            done(err)
          } else {
            expect(res.statusCode).toEqual(200)
            expect(typeof res.body).toEqual("object")
            expect(typeof res.body[0]).toEqual("object")
            expect(res.body[0]).toHaveProperty("_id")
            expect(typeof res.body[0]._id).toEqual("string")
            expect(res.body[0]).toHaveProperty("image_url")
            expect(typeof res.body[0].image_url).toEqual("string")
            expect(res.body[0]).toHaveProperty("price", products[0].price)
            expect(res.body[0]).toHaveProperty("like_count", products[0].like_count)
            done()
          }
        })
    })
  })
  describe("success get art by id", ()=> {
    it("should return status code 200", (done) => {
      request(app)
        .get('/arts/' + artId)
        .end((err, res) => {
          if(err){
            done(err)
          } else {
            expect(res.statusCode).toEqual(200)
            expect(typeof res.body).toEqual("object")
            expect(typeof res.body[0]).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("string")
            expect(res.body).toHaveProperty("image_url")
            expect(typeof res.body[0].image_url).toEqual("string")
            expect(res.body).toHaveProperty("price", products[0].price)
            expect(res.body).toHaveProperty("like_count", products[0].like_count)
            done()
          }
        })
    })
  })
})