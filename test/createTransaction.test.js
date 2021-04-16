const request = require('supertest')
const app = require('../app')

const { admin_token, user_token } = require('./token')

let createArt = {
  image_url: './test/image/gambar.jpg',
  price: 20000,
  like_count: 0
}
let artId = ''
describe('testing POST /transactions', () => {
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
    let createTransaction = {
      artId: artId,
      total: 50000
    }
    it("should return status code 201", (done) => {
      request(app)
        .post('/transaction')
        .set('access_token', user_tokenn,)
        .send(createTransaction)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual("object")
            expect(res.body).toHaveProperty("_id")
            expect(typeof res.body._id).toEqual("string")
            expect(res.body).toHaveProperty("artId", createTransaction.artId)
            expect(res.body).toHaveProperty("total", createTransaction.total)
            done();
          }
        })
    })
  })
})