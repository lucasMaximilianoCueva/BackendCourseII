import supertest from "supertest";
const request = supertest("http://localhost:5000");
import chai from "chai";
const expect = chai.expect;
import assert from "assert";

describe("test api rest", () => {
  describe("GET", () => {
    it("should return status 200", async () => {
      let response = await request.get("/api/products/");
      expect(response.status).to.eql(200);
    });
  });
  describe("POST", () => {
    it("should post a new product", async () => {
      let product = {
        title: "Ford Bronco Sport (test)",
        description:
          "Con un diseño robusto, tracción 4WD de serie y tecnología de vanguardia, esta SUV es tu llave de acceso a nuevas experiencias.",
        thumbnail:
          "https://www.ford.com.ar/content/ford/ar/es_ar/home/crossovers-suvs-4x4/bronco-sport/_jcr_content/par/common_box_1670404692/generalParsys/splitter/splitter0/image/image.imgs.full.high.png/1618870718279.png",
        price: 45000,
        stock: 20,
      };

      let response = await request.post("/api/products/").send(product);
      expect(response.status).to.eql(200);

    //   const prod = response.body;
    //   expect(prod).to.include.keys("title", "description", "thumbnail", "price", "stock");
    //   expect(prod.title).to.eql(product.title);
    //   expect(prod.description).to.eql(product.description);
    //   expect(prod.thumbnail).to.eql(product.thumbnail);
    //   expect(prod.price).to.eql(product.price);
    //   expect(prod.stock).to.eql(product.stock);
    });
  });
  describe("PUT", () => {
    it("should update a product", async () => {
      let product = {
        title: "Ford Bronco Sport (updated)",
        description:
          "Con un diseño robusto, tracción 4WD de serie y tecnología de vanguardia, esta SUV es tu llave de acceso a nuevas experiencias.",
        thumbnail:
          "https://www.ford.com.ar/content/ford/ar/es_ar/home/crossovers-suvs-4x4/bronco-sport/_jcr_content/par/common_box_1670404692/generalParsys/splitter/splitter0/image/image.imgs.full.high.png/1618870718279.png",
        price: 45000,
        stock: 20,
      };

      let response = await request.put("/api/products/612524c9b677ca0c1deb9f61").send(product);
      expect(response.status).to.eql(200);

    //   const prod = response.body;
    //   expect(prod).to.include.keys("title", "description", "thumbnail", "price", "stock");
    //   expect(prod.title).to.eql(product.title);
    //   expect(prod.description).to.eql(product.description);
    //   expect(prod.thumbnail).to.eql(product.thumbnail);
    //   expect(prod.price).to.eql(product.price);
    //   expect(prod.stock).to.eql(product.stock);
    });
  });
  describe("DETELE", () => {
    it("should delete a product", async () => {
      let response = await request.put("/api/products/612524c9b677ca0c1deb9f61")
      expect(response.status).to.eql(200);
    });
  });
});
