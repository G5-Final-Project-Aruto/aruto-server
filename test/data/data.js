const users = [
  {
    username: "rio",
    email: "rio@mail.com",
    password: "12345",
    full_name: "rio dicky",
  },
  {
    username: "harits",
    email: "harits@mail.com",
    password: "12345",
    full_name: "harits menida",
  },
];

const categories = [
  {
    title: "Digital Art",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/aruto-6e273.appspot.com/o/categories%2FDigital_Art.jpg?alt=media&token=3e1a4fc1-1491-4c1b-906f-55d44cc8b54f",
  },
  {
    title: "Fan Art",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/aruto-6e273.appspot.com/o/categories%2FFan_Art.jpg?alt=media&token=1c78d04f-4082-40c4-940c-8a8f8ffda790",
  },
];

const arts = [
  {
    title: "art1",
    price: 200000,
    image_url: "./test/data/art.png",
    image_name: "art.png",
  },
  {
    title: "art2",
    price: 200000,
    image_url: "./test/data/art.png",
    image_name: "art.png",
  },
];

module.exports = {
  users,
  categories,
  arts,
};
