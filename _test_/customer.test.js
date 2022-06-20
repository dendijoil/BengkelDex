const request = require("supertest");
const app = require("../app");
const { Workshop, Sequelize, User } = require("../models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../helpers");

const user1 = {
  name: "aldi2",
  username: 'aldi2',
  email: "aldi2@gmail.com",
  password: "124567",
  address: "kelapa gading",

};

const user2 = {
  name: 'user2',
  username: "user2",
  password: hashPassword('user2'),
  imgUrl: 'https://static.republika.co.id/uploads/images/inpicture_slide/logo-mc-donald-_130605182712-898.jpg',
  role: "user",
  email: "user@email.com",
  balance: 120000,
  statusBroadcast: true,
  address: "Bodjong Kenyot",
  location: Sequelize.fn("ST_GeomFromText", `POINT(0 0)`),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const workshopUser = {
  name: "Bengkel2 Pakde Ucok2",
  email: "bengkelpakdeucok2@email.com",
  password: hashPassword("12345"),
  statusOpen: false,
  phoneNumber: "0812341234",
  address: "Jl. Camar No.23, Pengasinan, Kec. Rawalumbu, Kota Bks, Jawa Barat 17115",
  location: Sequelize.fn("ST_GeomFromText", `POINT(107.01203573614205 -6.273844613790287)`),
  balance: 120000,
  role: "staff",
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll((done) => {
  Workshop.create(workshopUser)
  .then((registerWorkshop) => {
    // console.log(user2, 'user2');
    return User.create(user2)
  })
  .then((registerUser) => {
    // console.log(registerUser, 'registerUSer');
    done()
  })
  .catch((err) => {
    // console.log(err);
    done(err)
  })
});

afterAll(done => {
  Workshop.destroy({ truncate: true, cascade: true, restartIdentity: true})
  .then(_ => {
    return User.destroy({ truncate: true, cascade: true, restartIdentity: true})
  })
  .then(_ => {
    done();
  })
  .catch(err => {
    done(err);
  });
});

describe("POST /customers/register", () => {

  test("should return 201 status code - should the user successfully created", (done) => {
    request(app)
      .post("/customers/register")
      .send(user1)
      .end(function (req, res, next) {
        const { body, status } = res;
        expect(status).toEqual(201);
        // expect(body).toEqual({ name: 'aldi2', email: 'aldi2@gmail.com', balance: 0 });
        done();
      });
  });

  test("should return 401 status code - should the password is empty", (done) => {
    request(app)
      .post("/customers/register")
      .send({
        ...user1,
        password: null
      })
      .end(function (req, res, next) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("User.password cannot be null");
        done();
      });
  });

});

describe("POST /customers/login", () => {
  test("should return 201 status code - should the user successfully login", (done) => {
    request(app)
    .post('/customers/login')
    .send({
      email: user1.email,
      password: user1.password,
    })
    .end(function(req, res, next) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.token).toEqual(expect.any(String))
      expect(body.payload.id).toEqual(expect.any(Number))
      expect(body.payload.name).toEqual(expect.any(String))
      expect(body.payload.email).toEqual(expect.any(String))
      expect(body.payload.balance).toEqual(expect.any(Number))
      expect(body.payload.address).toEqual(expect.any(String))
      done()
    })
  })

  test("should return 401 status code - should the password is incorrect", (done) => {
    request(app)
    .post('/customers/login')
    .send({
      email: user1.email,
      password: '123456',
    })
    .end(function(req, res, next) {
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual("Invalid username or password")
      done()
    })
  })

})

// describe('PATCH /customers/broadcast', () => {
//   test('should return 201 status code - should the broadcast updated', () => {
//     request(app)
//     .patch('/customers/broadcast')
//     .send({
//       status: true
//     })
//     .end(function(req, res, next) {
//       const { body, status } = res;
//       console.log(body, 'bodyyyy');
//       expect(status).toEqual(201)
//       expect(body.message).toEqual("broadcast updated")
//       done()
//     })
//   })
// })