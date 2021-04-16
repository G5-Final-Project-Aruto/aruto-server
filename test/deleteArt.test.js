const request = require('supertest')
const app = require('../app')
const { admin_token, user_token } = require('./token')

let createArt = {
  image_url: './test/image/gambar.jpg',
  price: 20000,
  like_count: 0
}
let artId = ''

describe("Testing DELETE /arts", () => {
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

  describe("success case", () => {
    it("should return status code 200", (done) => {
      request(app)
        .delete('/arts/' + artId)
        .set("access_token", admin_token)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(200)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty(
              "message",
              "Art deleted successfully"
            )
            done()
          }
        })
    })
  })
  describe("failed case with status code 401", () => {
    it("should return error when not passed access_token", (done)=>{
      request(app)
        .delete('/arts/' + artId)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(401)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty(
              "message",
              "You must Login first"
            )
            done()
          }
        })
    })
    it("should return error when passing access_token for other user", (done) => {
      request(app)
      .delete('/arts/' + artId)
      .set("access_token", user_token)
      .end((err, res) => {
        if(err){
          done(err)
        }else{
          expect(res.statusCode).toEqual(401)
          expect(typeof res.body).toEqual("object")
          expect(res.body).toHaveProperty(
            "message",
            "Art deleted fail"
          )
          done()
        }
      })
    })
  })
})