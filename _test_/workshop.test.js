const request = require("supertest");
const app = require("../app");
const { Workshop, Sequelize, User } = require("../models");
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

const user2 = {
  name: 'user1',
  username: "user",
  password: "user",
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
  name: "Bengkel2 Pakde Ucok",
  email: "bengkelpakdeucok@email.com",
  password: hashPassword("12345"),
  statusOpen: true,
  phoneNumber: "0812341234",
  address: "Jl. Camar No.23, Pengasinan, Kec. Rawalumbu, Kota Bks, Jawa Barat 17115",
  location: Sequelize.fn("ST_GeomFromText", `POINT(106.82932 -6.25881)`),
  balance: 120000,
  role: "staff",
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll((done) => {
  Workshop.create(workshopUser)
  .then((registerUser) => {
    return User.create(user2)
  })
  .then((registerWorkshop) => {
    done()
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
    done();
  })
  .catch(err => {
    done(err);
  });
});

describe("POST /workshops/register", () => {

  test("register success with correct parameters", (done) => {
    request(app)
      .post("/workshops/register")
      .send(user1)
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(201);
        expect(body).toEqual({ name: 'aldi', email: 'aldi@gmail.com', balance: 0 });
        done();
      });
  });

  test("should return 400 status code - should the name is empty", (done) => {
    request(app)
      .post("/workshops/register")
      .send({
        ...user1,
        name: ''
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Name is required");
        done();
      });
  });

  test("should return 400 status code - should the email is empty", (done) => {
    request(app)
      .post("/workshops/register")
      .send({
        ...user1,
        email: ''
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Email is required");
        done();
      });
  });

  test("should return 400 status code - should the email is empty", (done) => {
    request(app)
      .post("/workshops/register")
      .send({
        ...user1,
        email: 'aji'

      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Email is invalid");
        done();
      });
  });

  test("should return 401 status code - should the password is empty", (done) => {
    request(app)
      .post("/workshops/register")
      .send({
        ...user1,
        email: 'adisusanto@gmail.com',
        password: ''
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Password is required");
        done();
      });
  });

  test("should return 401 status code - should the email is empty", (done) => {
    request(app)
      .post("/workshops/register")
      .send({
        ...user1,
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("email must be unique");
        done();
      });
  });

});

describe('POST /workshops/login', () => {

  test('success login', (done) => {
    request(app)
    .post('/workshops/login')
    .send({
      email: user1.email,
      password: user1.password,
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.token).toEqual(expect.any(String))
      expect(body.payload).toEqual(expect.any(Object))
      done()
    })
  })

  test('should return 401 status code - should the email is invalid', (done) => {
    request(app)
    .post('/workshops/login')
    .send({
      email: 'boy@gmail.com',
      password: "12456788",
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual('Invalid username or password')
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
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual('Invalid username or password')
      done()
    })
  })
})

describe("GET /workshops/need-help", () => { 
  test('200 Success update - should customer get location workshops', (done) => {
    request(app)
    .get('/workshops/need-help')
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body).toEqual(expect.any(Array))
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .get('/workshops/need-help?distance=abc')
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

 describe("GET /workshops/:workshopId", () => {
  test('200 Success get - should get workshop detail', (done) => {
    request(app)
    .get('/workshops/1')
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(status).toEqual(200)
      expect(body.id).toEqual(expect.any(Number))
      expect(body.Services).toEqual(expect.any(Array))
      expect(body.TalkJSID).toEqual(expect.any(String))
      expect(body.balance).toEqual(expect.any(Number))
      expect(body.email).toEqual(expect.any(String))
      expect(body.name).toEqual(expect.any(String))
      expect(body.location).toEqual(expect.any(Object))
      expect(body.role).toEqual('staff')
      expect(body.statusOpen).toEqual(expect.any(Boolean))
      done()
    })
  })

  test('200 Success get - should get workshop detail', (done) => {
    request(app)
    .get('/workshops/abc')
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(500)
      expect(body.message).toEqual('Internal server error')
      done()
    })
  })
})

 describe('status open workshops feature', () => {
  test('200 Success update - should status open workshops updated', (done) => {
    request(app)
    .patch('/workshops/1')
    .send({
      statusOpen: true,
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.message).toEqual('Success updated status')
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .patch('/workshops/abc')
    .send({
      statusOpen: true,
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(500)
      expect(body.message).toEqual('Internal server error')
      done()
    })
  })
})

describe('add services', () => {
  test('201 Success add services - should workshop add services', (done) => {
    request(app)
    .post('/workshops/services/1')
    .send({
      name: "Ganti oli",
      price: 70000,
      isPromo: false
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(201)
      expect(body.name).toEqual(expect.any(String))
      expect(body.price).toEqual(expect.any(Number))
      expect(body.isPromo).toEqual(expect.any(Boolean))
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .post('/workshops/services/abc')
    .send({
      price: 70000,
      isPromo: false
    })
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(500)
      expect(body.message).toEqual('Internal server error')
      done()
    })
  })
})

describe('GET /workshops/services/1', () => {
  test('200 Success Get services - should workshop get all services by id', (done) => {
    request(app)
    .get('/workshops/services/1')
    .end(function(err, res) {
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body).toEqual(expect.any(Array))
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .get('/workshops/services/ab')
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      const { body, status } = res;
      expect(status).toEqual(500)
      expect(body.message).toEqual('Internal server error')
      done()
    })
  })
})
