import { buildSchema } from "graphql";
import { ProductsRepository } from '../factory/productsFactory.js';
import config from "../config/config.js";

const option = Number(config.DB);
const productsRepository = new ProductsRepository(option);

var schema = buildSchema(`
type Query {
  product(_id: String): [Product]
  products: [Product]
},
type Mutation {
  postProduct(
    title: String,
    description: String,
    thumbnail: String,
    price: Int,
    stock: Int
    ): Product
},
type Product {
  _id: String,
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
product: (_id) => {
  return productsRepository.listById(_id);
},
products: () => {
  return productsRepository.list();
},
postProduct: (items= {title, description, thumbnail, price , stock}) => {
  return productsRepository.insert(items= {title, description, thumbnail, price , stock});
},
}

export {
    schema,
    root
}