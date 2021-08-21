import moment from 'moment';
import mongoose from "mongoose";
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

const Schema = mongoose.Schema

export class CartDB {
    constructor() {
        this.CART_DB  = [];
        this.nextCartDb = 0;
        this.timeStamp = moment().format('DD/MM/YYYY h:mm:ss a');
        this.codeProd = Math.round(Math.random()*10000); 
        this.ATLAS_URL =
        'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority';

        this.cartSchema = new Schema({
            title: String,
            description: String,
            timestamp: String,
            thumbnail: String,
            code: Number,
            price: Number,
            stock: Number,
          });

        this.cartDAO = mongoose.model("cart", this.cartSchema);

        mongoose.createConnection(
            this.ATLAS_URL,
            {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            },
            function(err, res) {
              try {
                logger.info("Mongo Atlas Connected (cart)");
              } catch(err) {
                throw err;
              }
            }
        );
    }

    getCart() {
        return this.cartDAO.find({})
    };

    getCartId(id) {
        return this.cartDAO.find({_id: id})
    };

    postCart(data) {
        const newProd = { ...data, timestamp: this.timeStamp, code:this.codeProd };
        return this.cartDAO.create(newProd)
    };

    deleteCartItem(id) {
        return this.cartDAO.deleteOne({_id: id})
    };
};

const cartDb = new CartDB();

export { cartDb };