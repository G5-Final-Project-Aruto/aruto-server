const admin = require("firebase-admin");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});
const bucket = admin.storage().bucket();

// handle input data
const uploadImage = (req) => {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    let fields = {},
      fileData = {},
      uploadedImage = false;

    // input preparation
    busboy.on("field", function (fieldname, val) {
      fields[fieldname] = val;
    });

    // file preparation
    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      uploadedImage = true;
      const ext = mimetype.split("/")[1];
      if (["jpeg", "jpg", "png"].includes(ext) === -1) {
        reject({ name: "Uploaded file must be image" });
        return;
      }

      const name = `${new Date().getTime()}-${Math.round(
        Math.random() * 1e5
      )}.${ext}`;
      const filepath = path.join(os.tmpdir(), name);
      file.pipe(fs.createWriteStream(filepath));
      fileData = { filepath, mimetype };
    });

    // upload file & write on db
    busboy.on("finish", async () => {
      const token = uuidv4();
      const dataReturn = {
        title: fields.title,
        price: fields.price,
      };

      if (!uploadedImage && !fields.latestUrl) {
        reject({ name: "Image is required" });
        return;
      }

      if (!uploadedImage && fields.latestUrl) {
        resolve({
          ...dataReturn,
          image_url: fields.latestUrl,
        });
        return;
      }

      if (fields.latestUrl) {
        await deleteImage(fields.latestUrl);
      }

      bucket.upload(
        fileData.filepath,
        {
          uploadType: "media",
          metadata: {
            metadata: {
              contentType: fileData.mimetype,
              firebaseStorageDownloadTokens: token,
            },
          },
        },
        (err, uploadedFile) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...dataReturn,
              image_url: `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${uploadedFile.name}?alt=media&token=${token}`,
            });
          }
        }
      );
    });

    req.pipe(busboy);
  });
};

const deleteImage = (image_url) => {
  if (image_url !== "") {
    const urlArr = image_url.split("/");
    const query = urlArr[urlArr.length - 1];
    const name = query.split("?")[0];
    return bucket.deleteFiles({
      prefix: name,
    });
  }
};

module.exports = { uploadImage, deleteImage };
