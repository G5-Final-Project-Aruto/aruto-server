const request = require('supertest')

const app = require('../app')

describe('testing /login', () => {
  describe('success login', () => {
    it('should return status code 200', (done) => {
      const body = {
        email: 'admin@gmail.com',
        password: 123456,
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("access_token");
            done()
          }
        })
    })
  })
  describe('failed case with status code 400', () => {
    it('should return error message when not input email or password', (done) => {
      const body = {
        email: '',
        password: '',
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "email or password required");
            done()
          }
        })
    })
    it('should return error message when not input password', (done) => {
      const body = {
        email: 'admin@gmail.com',
        password: '',
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "email or password required");
            done()
          }
        })
    })
    it('should return error message when not input email', (done) => {
      const body = {
        email: '',
        password: 123456,
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "email or password required");
            done()
          }
        })
    })
    it('should return error message when password wrong', (done) => {
      const body = {
        email: 'admin@gmail.com',
        password: 'qwertyui',
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "email or password invalid");
            done()
          }
        })
    })
    it('should return error message when email not found', (done) => {
      const body = {
        email: 'admin2@gmail.com',
        password: 123456,
      }

      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if(err){
            done(err)
          }else{
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "email or password invalid");
            done()
          }
        })
    })
  })
})