import moment from "moment";
import knexFunc from "knex";
import pino from 'pino'

const logger = pino();

export class ProductsDB {
  constructor(config) {
    this.knex = knexFunc(config);
    this.PRODUCTS_DB = [];
    this.nextProdDb = 0;
    this.timeStamp = moment().format("DD/MM/YYYY h:mm:ss a");
    this.codeProd = Math.round(Math.random() * 10000);
  }

  createTable() {
    logger.info('creando tabla')
      return this.knex.schema.createTableIfNotExists("items", (table) => {
        table.increments("_id").primary();
        table.string("title", 50).notNullable();
        table.string("description", 100).notNullable();
        table.string("timestamp", 50).notNullable();
        table.string("thumbnail", 1000).notNullable();
        table.string("code", 10).notNullable();
        table.float("price");
        table.integer("stock");
      });
  }

  //POST
  insert(items) {
    const newProd = { ...items, _id: ++this.nextProdDb, timestamp: this.timeStamp, code:this.codeProd };
    return this.knex("items").insert(newProd);
  }
  //GET
  list() {
    return this.knex("items").select();
  }
  //GET BY ID
  listById(id) {
    return this.knex("items").where("_id", id).select()
  }
  //DELETE BY ID
  deleteById(id) {
    return this.knex.from("items").where("_id", id).del();
  }
  //PUT
  updateById(id, data) {
    return this.knex.from("items").where("_id", id)
    .update({ 
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        price: data.price,
        stock: data.stock 
    });
  }
  close() {
    return this.knex.destroy();
  }
}

const config = {
    client: "sqlite3",
    connection: {
      filename: "./DB/prodDB.sqlite",
    },
    useNullAsDefault: true,
};

const prodSqlite3 = new ProductsDB(config);

export { prodSqlite3 };