import axios from "axios";

async function getProducts() {
  try {
    const response = await axios.get("http://localhost:5000/api/products/");
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

async function postProducts() {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/products/",
      {
        title: "Ford Bronco Sport (test)",
        description:
          "Con un diseño robusto, tracción 4WD de serie y tecnología de vanguardia, esta SUV es tu llave de acceso a nuevas experiencias.",
        thumbnail:
          "https://www.ford.com.ar/content/ford/ar/es_ar/home/crossovers-suvs-4x4/bronco-sport/_jcr_content/par/common_box_1670404692/generalParsys/splitter/splitter0/image/image.imgs.full.high.png/1618870718279.png",
        price: 45000,
        stock: 20,
      }
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

async function putProducts() {
  try {
    const response = await axios.put(
      "http://localhost:5000/api/products/612524c9b677ca0c1deb9f61",
      {
        title: "Ford Bronco Sport (updated)",
        description:
          "Con un diseño robusto, tracción 4WD de serie y tecnología de vanguardia, esta SUV es tu llave de acceso a nuevas experiencias.",
        thumbnail:
          "https://www.ford.com.ar/content/ford/ar/es_ar/home/crossovers-suvs-4x4/bronco-sport/_jcr_content/par/common_box_1670404692/generalParsys/splitter/splitter0/image/image.imgs.full.high.png/1618870718279.png",
        price: 45000,
        stock: 20,
      }
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

async function delProducts() {
  try {
    const response = await axios.delete(
      "http://localhost:5000/api/products/6125c25615c31604b6c40601"
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

Promise.all([getProducts(), postProducts(), putProducts(), delProducts()]).then(
  function (results) {
    const get = results[0];
    const post = results[1];
    const put = results[2];
    const del = results[3];
  }
);
