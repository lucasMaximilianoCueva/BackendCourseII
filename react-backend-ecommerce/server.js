import express from "express";
import { Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import cors from "cors";
import { cartDb } from "./cart.js";
import { ProductsRepository } from "./Config/ProductsRepository.js";
import { prodFaker } from "./Config/prodFaker.js";
import passport from "passport";
import passportConfig from './Config/passportConfig.js';
import { fork } from 'child_process';

const productsRepository = new ProductsRepository(6)

const app = express();
const httpServer = new HttpServer(app);

app.use(cookieParser('secret'))

app.use(session({
  store: mongoStore.create({ mongoUrl: 'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority',
  ttl: 60
}),
  secret: '123-456-789',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 600 },
  rolling: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.get("/api/cart", cors(), (req, res) => {
  res.json(cartDb.getCart());
});

app.get("/api/cart/:id", cors(), (req, res) => {
  const { id } = req.params;
  res.json(cartDb.getCartId(id));
});

app.post("/api/cart", (req, res) => {
  if (admin) {
    const data = req.body;
    cartDb.postCart(data);
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
});

app.delete("/api/cart/:id", (req, res) => {
  if (admin) {
    const { id } = req.params;
    res.json(cartDb.deleteCartItem(id));
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
});

// FAKE PRODUCTS (FAKER.JS)

app.get("/api/fakeprods/:id?", cors(), (req, res) => {
  const { id } = req.params;
  if(id) {
    res.json(prodFaker.listById(id))
  } else {
    prodFaker.populate(req.query.q);
    res.json(prodFaker.list())
  }
});

//----------------------------------------- PASSPORT ---------------------------------------------------

app.get('/auth/facebook', cors(), passport.authenticate('facebook'));

app.get('/auth/facebook/callback', cors(), passport.authenticate('facebook', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: '/faillogin'
}));

app.get("/user", (req, res) => {
  res.json({
    name: req.user.displayName,
    photo: req.user.photos[0].value,
    email: req.user.emails[0].value,
});
});

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('http://localhost:3000/login')
  }
}

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/')
  })

//----------------------------------------- END PASSPORT ---------------------------------------------------

//----------------------------------------- INFO - RANDOMS ---------------------------------------------------

app.get("/api/info", cors(), (req, res) => {
  res.json({
    inputArguments: process.argv,
    platformName: process.platform,
    nodejsVersion: process.version,
    memoryUsage: process.memoryUsage(),
    executionPath: process.execPath,
    processId: process.pid,
    currentFolder: process.cwd
  });
});

app.get("/api/randoms", cors(), (req, res) => {
  const quantity = req.query.quan || 100000000;

  const forked = fork('./Config/calc.js');
  setTimeout(() => {
    forked.send(quantity);
  }, 1000);
  forked.on("message", msg => {
    res.json({randoms: msg})
  });

});

//-----------------------------------------  ---------------------------------------------------

app.get("/api/products", cors(), (req, res) => {
  // productsRepository.create(); // ifNotExist
  productsRepository
    .list()
    .then((items) => {
      let response = [];
      console.log(req.query);

      if (typeof req.query.sale != "undefined") {
        items.filter(function (item) {
          if (item.sale.toString() == req.query.sale) { // offers
            response.push(item);
          }
        });
      }
      if (typeof req.query.title != "undefined") { //title
        items.filter(function (item) {
          if (item.title.toLowerCase() == req.query.title) {
            response.push(item);
          }
        });
      }
      if (typeof req.query.code != "undefined") { //code
        items.filter(function (item) {
          if (item.code.toString() == req.query.code) {
            response.push(item);
          }
        });
      }
      if (typeof req.query.price != "undefined") { //price A
        items.filter(function (item) {
          if (item.price.toString() === req.query.price) {
            response.push(item);
          } 
        });
      }
      if (typeof req.query.stock != "undefined") { //stock
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
});

app.get("/api/products/:id", cors(), (req, res) => {
  const { id } = req.params;
  productsRepository.listById(id).then((list) => {
    res.json(list);
  })
});

app.post("/api/products", (req, res) => {
  if (isAuth) {
    const data = req.body;
    productsRepository.insert(data).then(() => {
      res.json(data)
    })
    // res.redirect('http://localhost:3000/products');
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
});

app.put("/api/products/:id", isAuth, (req, res) => {
  if (req.session && req.session.user === "Lucas" && req.session.admin) {
    const data = req.body;
    const { id } = req.params;
    productsRepository.updateById(id, data).then(() => {
      res.json(data)
    })
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
});

app.delete("/api/products/:id", isAuth, (req, res) => {
  if (isAuth) {
    const { id } = req.params;
    productsRepository.deleteById(id).then(() => {
      res.json(`product with id ${id} deleted`)
    })
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
});

const port = process.argv[2] || 5000;

httpServer.listen(port, () => `Server running on port ${port}`);
