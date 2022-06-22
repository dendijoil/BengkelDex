const request = require("supertest");
const app = require("../app");
const { Workshop, Sequelize, User, Order, Service } = require("../models");
const jwt = require("jsonwebtoken");
const { hashPassword, generateToken } = require("../helpers");
let access_token;

const user1 = {
  name: "budi",
  username: 'budi',
  email: "budi@gmail.com",
  password: "124567",
  address: "kelapa gading",

};

const user2 = {
  name: 'budi2',
  username: "budi2",
  password: hashPassword('budi2'),
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

const order1 = {
  UserId: 1,
  WorkshopId: 1,
  date: new Date(),
  paymentStatus: false,
  totalPrice: 50000,
  paymentType: 'online',
}

const service1 = {
  name: "Ganti ban",
  price: 60000,
  isPromo: false
}

beforeAll((done) => {
  Workshop.create(workshopUser)
  .then((registerWorkshop) => {
    return User.create(user2)
  })
  .then((registerUser) => {
   access_token = generateToken({
      id: registerUser.id,
      name: registerUser.name,
      email: registerUser.email,
      balance: registerUser.balance,
      address: registerUser.address,
      location: registerUser.location,
      role: registerUser.role,
    })
    return Order.create(order1)
    .then((orderUser) => {
      return Service.create(service1)
    })
    .then((orderUser) => {
      done()
    })
  })
  .catch((err) => {
    done(err)
  })
});

afterAll(done => {
  Workshop.destroy({ truncate: true, cascade: true, restartIdentity: true})
  .then(_ => {
    return User.destroy({ truncate: true, cascade: true, restartIdentity: true})
  })
  .then(_ => {
    return Order.destroy({ truncate: true, cascade: true, restartIdentity: true})
  })
  .then(_ => {
    done();
  })
  .catch(err => {
    done(err);
  });
});

describe("POST /payment/:OrderId", () => { 
  test('200 Success update - should customer get location workshops', (done) => {
    request(app)
    .post('/payment/1?WorkshopId=1&UserId=1')
    .set("access_token", access_token)
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.message).toEqual('Success')

      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .post('/payment/abc')
    .set("access_token", access_token)
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(500)
      expect(body.message).toEqual('Internal server error')
      done()
    })
  })
 })