import moment from "moment";
import mongoose from "mongoose"
import pino from 'pino'
import { productsDAO } from "../models/productSchema.js";

const logger = pino({
  prettyPrint: { colorize: true }
});

const Schema = mongoose.Schema

export class ProdMongo {
  constructor({conex}) {
    this.PRODUCTS_DB = [];
    this.timeStamp = moment().format("DD/MM/YYYY h:mm:ss a");
    this.codeProd = Math.round(Math.random() * 10000);
    this.url = "mongodb://localhost:27017/ecommerce";
    this.ATLAS_URL =
      'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority';

    if(conex === "local") {
      mongoose.connect(
        this.url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
        (err) => {
          if (err) {
            logger.error(err);
          } else {
            logger.info("products connected to the base");
          }
        }
      );
    } else {
      mongoose.createConnection(
        this.ATLAS_URL,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        function(err, res) {
          try {
            logger.info("Mongo Atlas Connected");
          } catch(err) {
            throw err;
          }
        }
      );
    }
    
  }
  //GET
  list() {
    return productsDAO.find({})
  }
  //POST
  insert(items) {
    const newProd = { ...items, timestamp: this.timeStamp, code:this.codeProd };
    return this.productsDAO.create(newProd)
  }
  //GET BY ID
  listById(id) {
    return productsDAO.find({_id: id})
  }
  //DELETE BY ID
  deleteById(id) {
    return productsDAO.deleteOne({_id: id})
  }
  //PUT
  updateById(id, data) {
    return productsDAO.updateOne({_id: id}, {$set: data})
  }
}