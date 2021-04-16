const request = require('supertest')
const { User } = require('../models')

const app = require('../app')

let registerUserTest = {
  username: 'admin',
  email: 'admiin@gmail.com',
  password: 123456,
  first_name: 'admin',
  last_name: 'doang',
  art: []
}

describe('Testing post /register', () => {
  afterAll((done) => {
    User.remove()
      .exec()
      .then()
      .catch(done)
  })

  describe("succes case", () => {
    it('should return response with status code 201', (done) => {
      request(app)
        .post('/register')
        .send(registerUserTest)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('_id')
            expect(typeof res.body._id).toEqual('string')
            expect(res.body).toHaveProperty('username', registerUserTest.username)
            expect(res.body).toHaveProperty('email', registerUserTest.email)
            expect(res.body).toHaveProperty('first_name', registerUserTest.first_name)
            expect(res.body).toHaveProperty('last_name', registerUserTest.last_name)
            done()
          }
        })
    })
  })
  describe.each([
    ["username", "empty", { ...registerUserTest, username: "" }, "UserName is required"],
    ["email", "empty", { ...registerUserTest, email: "" }, "email is required"],
    ["password", "empty", { ...registerUserTest, password: "" }, "password is required"],
    ["first_name", "empty", { ...registerUserTest, first_name: "" }, "First Name is required"],
    ["last_name", "empty", { ...registerUserTest, last_name: "" }, "LastName is required"],
  ])( 'failed case with status code 400', (attribute, testCase, input, expected) => {
    it(`should return message '${expected}' when ${attribute} is '${testCase}'`, (done) => {
      request(app)
        .post('/register')
        .send(registerUserTest)
        .end((err, res) => {
          if(err) {
            done(err)
          }else{
            expect(res.statusCode).toEqual(400)
              expect(typeof res.body).toEqual("object")
              expect(res.body).toHaveProperty("message", `${expected}`)
              done()
          }
        })
    })
  })
})