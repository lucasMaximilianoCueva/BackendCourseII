import { buildSchema } from "graphql";
import { ProductsRepository } from '../factory/productsFactory.js';
import config from "../config/config.js";

const option = Number(config.DB);
const productsRepository = new ProductsRepository(option);

var schema = buildSchema(`
type Query {
  product(id: String): Product
  products: [Product]
},
type Mutation {
  postProduct(id: String): Product
},
type Product {
  id: String,
  title: String,
  description: String,
  timestamp: String,
  thumbnail: String,
  code: Int,
  price: Int,
  stock: Int,
}
`);

var root = {
product: () => {
  return productsRepository.listById(id);
},
products: () => {
  return productsRepository.list();
},
postProduct: () => {
  return productsRepository.insert(items);
},
}

export {
    schema,
    root
}