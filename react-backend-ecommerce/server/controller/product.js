import { ProductsRepository } from "../factory/productsFactory.js";
import config from "../config/config.js";
import { isAuth } from '../middlewares/auth.js'

const option = Number(config.DB);
const productsRepository = new ProductsRepository(option);

async function getDataController(req, res) {
  productsRepository
    .list()
    .then((items) => {
      let response = [];

      if (typeof req.query.sale != "undefined") {
        items.filter(function (item) {
          if (item.sale.toString() == req.query.sale) {
            // offers
            response.push(item);
          }
        });
      }
      if (typeof req.query.title != "undefined") {
        //title
        items.filter(function (item) {
          if (item.title.toLowerCase() == req.query.title) {
            response.push(item);
          }
        });
      }
      if (typeof req.query.code != "undefined") {
        //code
        items.filter(function (item) {
          if (item.code.toString() == req.query.code) {
            response.push(item);
          }
        });
      }
      if (typeof req.query.price != "undefined") {
        //price A
        items.filter(function (item) {
          if (item.price.toString() === req.query.price) {
            response.push(item);
          }
        });
      }
      if (typeof req.query.stock != "undefined") {
        //stock
        items.filter(function (item) {
          if (item.stock.toString() == req.query.stock) {
            response.push(item);
          }
        });
      }
      if (Object.keys(req.query).length === 0) {
        response = items;
      }
      res.json(response);
    })
    .catch(function (err) {
      throw err; // or handle it
    });
}

async function getDataByIdController(req, res) {
  const { id } = req.params;
  productsRepository.listById(id).then((list) => {
    res.json(list);
  });
}

async function postDataController(req, res) {
  if (isAuth) {
    const data = req.body;
    productsRepository.insert(data).then(() => {
      res.json(`Product added: ${data[0]}`);
    });
    // res.redirect('http://localhost:3000/products');
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

async function putDataController(req, res) {
  if (isAuth) {
    const data = req.body;
    const { id } = req.params;
    productsRepository.updateById(id, data).then(() => {
      res.json(`product with id ${id} updated`);
    });
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

async function deleteDataController(req, res) {
  if (isAuth) {
    const { id } = req.params;
    productsRepository.deleteById(id).then(() => {
      res.json(`product with id ${id} deleted`);
    });
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

export {
  getDataController,
  getDataByIdController,
  postDataController,
  putDataController,
  deleteDataController,
};
