import moment from 'moment';

export class ProductsDB {
    constructor() {
        this.PRODUCTS_DB = [];
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
        return data;
    };

    deleteById(id) {
        const delProd = this.PRODUCTS_DB.filter(
            (product) => product._id == id 
        );
        this.PRODUCTS_DB = this.PRODUCTS_DB.filter(
            (product) => product._id !== Number(id)
        )
        return delProd
    };
};

const prodServerMemory = new ProductsDB();

export { prodServerMemory };