const midtransClient = require("midtrans-client");
// Create Snap API instance
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-sedPETkPfAFZtXH2pw6EJtxz",
  clientKey: "SB-Mid-client-XEgK69ZpjxjU7EK5",
});

module.exports = snap;