const {Workshop} = require('./models')

const workshopUser = {
  name: "Bengkel Pakde Ucok",
  email: "bengkelpakdeucok@email.com",
  password: "12345",
  statusOpen: false,
  phoneNumber: "0812341234",
  address: "Jl. Camar No.23, Pengasinan, Kec. Rawalumbu, Kota Bks, Jawa Barat 17115",
  location: [107.01203573614205, -6.273844613790287],
  balance: 120000,
  role: "staff",
  createdAt: new Date(),
  updatedAt: new Date()
}

Workshop.create(workshopUser)
.then((data) => {
  console.log(data);
})
.catch(err => {
  console.log(err);
})



