'use strict'

const Product = use("App/Models/Product");

class ProductController {
  async index() {
    const product = await Product.all();
    return product;
  }

  async detail({
    params
  }) {
    const product = await Product.find(params.id);

    return product;
  }

  async post({
    request,
    response,
    session
  }) {
    const product = new Product();

    product.name = request.input("name");
    product.price = request.input("price");
    product.description = request.input("description");

    await product.save();

    return product;
  }

  async delete({
    params,
    session,
    response
  }) {
    const product = await Product.find(params.id);

    await product.delete();

    return "Product Deleted";
  }
}

module.exports = ProductController
