const request = require("supertest");
const app = require("../app");
const { Workshop, Sequelize, User } = require("../models");
const jwt = require("jsonwebtoken");
const { hashPassword, generateToken } = require("../helpers");
let access_token;

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
  statusBroadcast: false,
  address: "Bodjong Kenyot",
  location: Sequelize.fn("ST_GeomFromText", `POINT(0 0)`),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const workshopUser = {
  name: "Bengkel2 Pakde Ucok2",
  email: "bengkelpakdeucok2@email.com",
  password: hashPassword("12345"),
  statusOpen: true,
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

describe("POST /customers/register", () => {
  test("should return 201 status code - should the user successfully created", (done) => {
    request(app)
      .post("/customers/register")
      .send(user1)
      .end(function (err, res) {
        if (err) {
          return done(err)
        };
        const { body, status } = res;
        expect(status).toEqual(201);
        expect(body.message).toEqual("success create user");
        done();
      })
  });

  test("should return 400 status code - should the name is empty", (done) => {
    request(app)
      .post("/customers/register")
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

  test("should return 400 status code - should the username is empty", (done) => {
    request(app)
      .post("/customers/register")
      .send({
        ...user1,
        username: ''
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Username is required");
        done();
      });
  });

  test("should return 400 status code - should the password is empty", (done) => {
    request(app)
      .post("/customers/register")
      .send({
        ...user1,
        password: ''
      })
      .end(function (err, res) {
        const { body, status } = res;
        expect(status).toEqual(400);
        expect(body.message).toEqual("Password is required");
        done();
      });
  });

  test("should return 400 status code - should the email is empty", (done) => {
    request(app)
      .post("/customers/register")
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

  test("should return 400 status code - should the email is not unique", (done) => {
    request(app)
      .post("/customers/register")
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

  test("should return 400 status code - should the email is invalid", (done) => {
    request(app)
      .post("/customers/register")
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
});

describe("POST /customers/login", () => {
  test("should return 201 status code - should the user successfully login", (done) => {
    request(app)
    .post('/customers/login')
    .send({
      email: user1.email,
      password: user1.password,
    })
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body.token).toEqual(expect.any(String))
      expect(body.payload.id).toEqual(expect.any(Number))
      expect(body.payload.name).toEqual(expect.any(String))
      expect(body.payload.email).toEqual(expect.any(String))
      expect(body.payload.balance).toEqual(expect.any(Number))
      expect(body.payload.role).toEqual('customer')
      expect(body.payload.TalkJSID).toEqual(expect.any(String))
      done()
    })
  })

  test("should return 401 status code - should the email is incorrect", (done) => {
    request(app)
    .post('/customers/login')
    .send({
      email: 'kuproy@gmail.com',
      password: '123456',
    })
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual("Invalid username or password")
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
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual("Invalid username or password")
      done()
    })
  })
})

describe("GET /customers/near-workshop", () => { 
  test('200 Success get near workshop - should customer get location workshops', (done) => {
    request(app)
    .get('/customers/near-workshop')
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(200)
      expect(body).toEqual(expect.any(Array))
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .get('/customers/near-workshop?distance=abc')
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

describe('PATCH /customers/broadcast', () => {
  test('should return 201 status code - should the broadcast updated', (done) => {
    request(app)
    .patch('/customers/broadcast')
    .set("access_token", access_token)
    .send({
      status: true,
      latitude: 106.82932,
      longitude: -6.25881
    })
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(201)
      expect(body.message).toEqual("broadcast updated")
      done()
    })
  })

  test('should return 401 status code - should the invalid token', (done) => {
    request(app)
    .patch('/customers/broadcast')
    .set("access_token", 'abcd')
    .send({
      status: true,
      latitude: 106.82932,
      longitude: -6.25881
    })
    .end(function(err, res) {
      if(err) {
        return done(err)
      }
      const { body, status } = res;
      expect(status).toEqual(401)
      expect(body.message).toEqual("invalid token")
      done()
    })
  })

  test('should return 500 status code - should the internal server error', (done) => {
    request(app)
    .patch('/customers/broadcast')
    .set("access_token", access_token)
    .send({
      status: 'abc',
      latitude: 106.82932,
      longitude: -6.25881
    })
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