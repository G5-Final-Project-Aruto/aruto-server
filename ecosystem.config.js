module.exports = {
  apps: [
    {
      name: "Aruto - Server",
      script: "nodemon ./bin/http.js",
      env: {
        JWT_SECRET_KEY: "verysecret",
        STORAGE_BUCKET: "aruto-6e273.appspot.com",
        MIDTRANS_SERVER_KEY: "SB-Mid-server-OC-CpMu5lkZ2JT7mMyfnvDf0",
        MIDTRANS_CLIENT_KEY: "SB-Mid-client-kOg3pJdjMxNkUPCY",
        MONGO_URI:
          "mongodb+srv://arutoaruto:PyuLs8IW2g8wv0ji@cluster0.hcbdf.mongodb.net/aruto?retryWrites=true&w=majority",
      },
    },
  ],
};
