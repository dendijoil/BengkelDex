const request = require("supertest");
const app = require("../app");
const { Workshop, Sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../helpers");

const user1 = {
  name: "aldi",
  email: "aldi@gmail.com",
  password: "124567",
  phoneNumber: 1234567,
  address: "kelapa gading",
  longitude: -6.25881,
  latitude: 106.82932,

};

const workshopUser = {
  name: "Bengkel2 Pakde Ucok",
  email: "bengkelpakdeucok@email.com",
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
  .then((registerUser) => {
    done()
  })
  .catch((err) => {
    console.log(err);
    done(err)
  })
});

afterAll(done => {
  Workshop.destroy({ truncate: true, cascade: true, restartIdentity: true})
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("register workshop", () => {

  test("register success with correct parameters", (done) => {
    request(app)
      .post("/workshops/register")
      .send(user1)
      .end(function (req, res, next) {
        const { body, status } = res;
        expect(status).toEqual(201);
        expect(body).toEqual({ name: 'aldi', email: 'aldi@gmail.com', balance: 0 });
        done();
      });
  });

});

describe('login feature', () => {

  test('success login', (done) => {
    request(app)
    .post('/workshops/login')
    .send({
      email: user1.email,
      password: user1.password,
    })
    .end(function(req, res, next) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.token).toEqual(expect.any(String))
      expect(body.payload).toEqual(expect.any(Object))
      done()
    })
  })

  test('wrong password login', (done) => {
    request(app)
    .post('/workshops/login')
    .send({
      email: 'aldi@gmail.com',
      password: "12456788",
    })
    .end(function(req, res, next) {
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual('Invalid username/password')
      done()
    })
  })
})

describe('status open workshops feature', () => {
  test.only('200 Success update - should status open workshops updated', (done) => {
    request(app)
    .patch('/workshops/1')
    .send({
      statusOpen: true,
    })
    .end(function(req, res, next) {
      const { body, status } = res;
      expect(status).toEqual(200)
      console.log(body, 'lllllllllll');
      expect(body.message).toEqual('Success updated statusOpen')
      done()
    })
  })
})

// describe('add services', () => {
//   test.only('201 Success add services - should workshop add services', (done) => {
//     request(app)
//     .post('/services/1')
//     .send({
//       name: 'ganti oli',
//       description: ''
//     })
//     .end(function(req, res, next) {
//       const { body, status } = res;
//       expect(status).toEqual(200)
//       expect(body.message).toEqual('Success updated statusOpen')
//       done()
//     })
//   })
// })

// describe('workshops feature', () => {
//   test('find workshop by radius', (done) => {
//     request(app)
//     .get('/workshops')
//     .end(function(req, res) {
//       expect(res.body.statusCode).toEqual(200)
//       expect(res.body.data.rows).toEqual(expect.any(Array))
//       console.log(res.body, '<<<<<<<<<<<<<');
//       done()
//     })
//   })
// })



// describe('get workshop id', () => { 
//   test('200 Success get - should get workshop services by id', () => {
     
//   })
// })

// describe('get workshop id', () => { 
//   test('200 Success get - should get workshop services by id', () => {
     
//   })
// })

  // test('success login', (done) => {
  //   request(app)
  //   .post('/workshops/login')
  //   .send({
  //     email: 'aldo@gmail.com',
  //     password: '124567',
  //   })
  //   .set('content-type', 'application/json')
  //   .end(function(req, res, next) {
  //     const { body, status } = res;
  //     expect(status).toEqual(200)
  //     expect(body.token).toEqual(expect.any(String))
  //     expect(body.payload).toEqual(expect.any(Object))


  //     // expect(body.message).toEqual('success login')
  //     done()
  //   })
  // })

    // test('register without name should return error message', (done) => {
  //   request(app)
  //     .post('/workshops/register')
  //     .send({
  //       name: undefined,
  //       email: "aldo@gmail.com",
  //       password: "124567",
  //       phoneNumber: 1234567,
  //       address: "kelapa gading",
  //       longitude: 1111,
  //       latitude: 12345,
  //     })
  //     .end(function(req, res, next) {
  //       const { body, status } = res;
  //       expect(status).toEqual(500)
  //       expect(body).toEqual('Name is required')
  //       done()
  //     })
  // })

  
    // test("register success with correct parameters", (done) => {
  //   request(app)
  //     .post("/workshops/register")
  //     .send({
  //       name: "aldo5",
  //       email: "aldo5@gmail.com",
  //       password: "124567",
  //       phoneNumber: 1234567,
  //       address: "kelapa gading",
  //       longitude: -6.25881,
  //       latitude: 106.82932,
  //     })
  //     .end(function (req, res, next) {
  //       const { body, status } = res;
  //       expect(status).toEqual(201);
  //       expect(body).toEqual({ name: 'aldo5', email: 'aldo5@gmail.com', balance: 0 });
  //       done();
  //     });
  // });
