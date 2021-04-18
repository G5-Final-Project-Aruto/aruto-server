const Chai = require('chai')
const { expect } = Chai
const chaiHttp = require("chai-http")
const fs = require('fs')

const app = require('../app')
const { Art, User } = require('../models')

Chai.use(chaiHttp)

let arts = JSON.parse(fs.readFileSync('./data/arts.json', 'utf-8'))
let user = {
    "username": "rio",
    "email": "rio@mail.com",
    "password": 12345,
    "full_name": "rio dicky",
    "art": []
}

describe('testing GET /arts', () => {
    before((done) => {
        User.create(user)
            .then((data) => {
                arts.forEach(art => {
                    art.user = data._id
                })
                return Art.insertMany(arts)
            })
            .then(() => done())
            .catch((err) => console.log(err))
    })

    after((done) => {
        Art.deleteMany({})
            .then(() => User.deleteMany({}))
            .then(() => done())
            .catch((err) => console.log(err))
    })

    describe('success case', () => {
        it("should return response with status code 200", (done) => {
            Chai.request(app)
                .get('/arts')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.an('array')
                    expect(res.body[0]).to.have.an('object')
                    expect(res.body[0]).to.have.property('_id')
                    expect(res.body[0]).to.have.property('title', arts[0].title)
                    expect(res.body[0]).to.have.property('image_url', arts[0].image_url)
                    expect(res.body[0]).to.have.property('price', arts[0].price)
                    done()
                })
        })
    })
})