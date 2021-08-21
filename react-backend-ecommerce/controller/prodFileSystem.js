import moment from 'moment';
import fs from 'fs';
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

export class ProductsDB {
    constructor() {
        this.PRODUCTS_DB = fs.readFile('./DB/Products.txt', 'utf-8', (err, data) => {
            if (err) {
                logger.error("Error reading the file");
            } else {
                this.PRODUCTS_DB = JSON.parse(data)
            }
        });
        this.nextProdDb = 0;
        this.timeStamp = moment().format('DD/MM/YYYY h:mm:ss a');
        this.codeProd = Math.round(Math.random()*10000); 
    }

    list() {
        return this.PRODUCTS_DB.length
        ? [...this.PRODUCTS_DB]
        : { error: 'No Products Loaded' }
    };

    listById(id) {
        const reqP = this.PRODUCTS_DB.find(
            (product) => product._id == (id)
        );
        return reqP || { error: 'No Products Founded' }
    };

    insert(items) {
        const newProd = { ...items, _id: ++this.nextProdDb, timestamp: this.timeStamp, code:this.codeProd };
        this.PRODUCTS_DB.push(newProd);
        fs.writeFileSync(`./DB/Products.txt`, JSON.stringify(this.PRODUCTS_DB))
        return newProd;
    };

    updateById(id, data) {
        this.PRODUCTS_DB = this.PRODUCTS_DB.map((product) => {
            if(product._id == id) {
                product.title = data.title;
                product.price = data.price;
                product.thumbnail = data.thumbnail;
                product.description = data.description;
                product.stock = data.stock;
            }
            return product;
        });
        fs.writeFileSync(`./DB/Products.txt`, JSON.stringify(this.PRODUCTS_DB))
        return data;
    };

    deleteById(id) {
        const delProd = this.PRODUCTS_DB.filter(
            (product) => product._id == id 
        );
        this.PRODUCTS_DB = this.PRODUCTS_DB.filter(
            (product) => product._id !== Number(id)
        )
        fs.writeFileSync(`./DB/Products.txt`, JSON.stringify(this.PRODUCTS_DB))
        return delProd
    };
};

const prodFs = new ProductsDB();

export { prodFs };