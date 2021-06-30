import moment from "moment";
import mongoose from "mongoose"

const Schema = mongoose.Schema

export class ProdMongo {
  constructor({conex}) {
    this.PRODUCTS_DB = [];
    this.timeStamp = moment().format("DD/MM/YYYY h:mm:ss a");
    this.codeProd = Math.round(Math.random() * 10000);
    this.url = "mongodb://localhost:27017/ecommerce";
    this.ATLAS_URL =
      'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority';

    this.productsSchema = new Schema({
      title: String,
      description: String,
      timestamp: String,
      thumbnail: String,
      code: Number,
      price: Number,
      stock: Number,
    });

    this.productsDAO = mongoose.model("items", this.productsSchema);

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
            console.log(err);
          } else {
            console.log("products connected to the base");
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
            console.log("Mongo Atlas Connected");
          } catch(err) {
            throw err;
          }
        }
      );
    }
    
  }
  //GET
  list() {
    return this.productsDAO.find({})
  }
  //POST
  insert(items) {
    const newProd = { ...items, timestamp: this.timeStamp, code:this.codeProd };
    return this.productsDAO.create(newProd)
  }
  //GET BY ID
  listById(id) {
    return this.productsDAO.find({_id: id})
  }
  //DELETE BY ID
  deleteById(id) {
    return this.productsDAO.deleteOne({_id: id})
  }
  //PUT
  updateById(id, data) {
    return this.productsDAO.updateOne({_id: id}, {$set: data})
  }
}