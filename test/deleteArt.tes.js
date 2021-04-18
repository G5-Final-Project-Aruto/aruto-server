const Chai = require('chai')
const { expect } = Chai
const chaiHttp = require('chai-http')

const { getToken } = require('../helpers')

const app = require('../app')
const { Art, User} = require('../models')

Chai.use(chaiHttp)

let user = {
    "username": "rio",
    "email": "rio@mail.com",
    "password": 12345,
    "full_name": "rio dicky",
    "art": []
}
let art = {
    "title": "first",
    "image_url": "https://m.media-amazon.com/images/M/MV5BZmYzMzU4NjctNDI0Mi00MGExLWI3ZDQtYzQzYThmYzc2ZmNjXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_UX182_CR0,0,182,268_AL_.jpg",
    "price": 200000
}
let access_token = ''
let id = ''

describe('testing DELETE /arts', () => {
     
    before((done) => {
        User.create(user)
            .then((data) => {
                access_token = getToken({
                    _id: data._id,
                    email: data.email
                })
                art.user = data._id
                return Art.create(art)
            })
            .then(dataArt => {
                id = dataArt._id
                done()
            })
            .catch(err => console.log(err))
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
                .delete(`/arts/${id}`)
                .set('access_token', access_token)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('message', 'success delete art')
                })
        })
    })
})