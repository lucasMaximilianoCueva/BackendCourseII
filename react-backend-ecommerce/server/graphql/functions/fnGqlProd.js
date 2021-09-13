import { ProductsRepository } from '../../factory/productsFactory.js';
import config from "../../config/config.js";

const option = Number(config.DB);
const productsRepository = new ProductsRepository(option);

async function getProducts() {
  try {
    const prodInDb = await productsRepository.list();
    return prodInDb;
  } catch (error) {
    console.log(error);
  }
}

async function createProduct({ title, price, thumbnail, stock, description }) {
  try {
    const data = { title, price, thumbnail, stock, description };
    const newProd = await productsRepository.insert(data);
    return await newProd;
  } catch (error) {
    console.log(error);
  }
}

async function getById(_id) {
  try {
    const { title, price, thumbnail, stock, description } = await productsRepository.listById(
      _id
    );
    return { title, price, thumbnail, stock, description };
  } catch (error) {
    console.log(error);
  }
}

async function updateProduct({input}) {
  try {
    const _id = (input._id);
    const data = {title, price, thumbnail, stock, description} = await {... input};
    await productsRepository.updateById(_id, data);
    const result = "product updated!"
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(_id) {
  try {
    await productsRepository.deleteById(_id);
    const result = "product deleted!";
    return result;
  } catch (error) {
    console.log(error);
  }
}

export {
    getProducts,
    createProduct,
    getById,
    updateProduct,
    deleteProduct
}