const midtransClient = require('midtrans-client');

const serverKey = 'SB-Mid-server-OC-CpMu5lkZ2JT7mMyfnvDf0';

const clientKey = 'SB-Mid-client-kOg3pJdjMxNkUPCY'

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction : false,
  serverKey : serverKey,
  clientKey : clientKey
});

module.exports = snap