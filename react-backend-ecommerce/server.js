import express from "express";
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import cors from "cors";
import { cartDb } from "./cart.js";
import { chat } from "./chat.js";
import { ProductsRepository } from "./Core/ProductsRepository.js";
import { prodFaker } from "./Core/prodFaker.js";

const productsRepository = new ProductsRepository(6)

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

app.use(cookieParser('secret'))

app.use(session({
  store: mongoStore.create({ mongoUrl: 'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority',
  ttl: 60
}),
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  // cookie: { maxAge: 1000 * 600 },
  rolling: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API PROD

//********** SESSION  **********//

const auth = (req, res, next) => {
  if(req.session && req.session.user === "Lucas" && req.session.admin) {
      return next();
  } else {
      return res.sendStatus(401);
  }
}

app.get('/content', auth, (req, res) => { //prueba
  res.send("redirecting to the login form")
})

app.post('/api/login', (req, res) => {
  const data = req.body;
  if(!data.username) {
    res.send('login failed');
  } else if(data.username === "Lucas") {
    req.session.user = "Lucas";
    req.session.admin = true;
    res.json({"username": req.session.user})
  }
})

app.get('/login', cors(), (req, res) => {
  if(!req.query.username) {
      res.send('login failed');
  } else if(req.query.username === "Lucas") {
      req.session.user = "Lucas";
      req.session.admin = true;
      res.redirect('http://localhost:3000/add')
  }
});

app.get('/user', cors(), (req, res) => {
  res.send({username: req.session.user})
})

// app.get('/', (req, res) => {
//   if (req.session.contador) {
//     req.session.contador++
//     res.send(`${getNombreSession(req)} visitaste la página ${req.session.contador} veces.`)
//   }
//   else {
//     req.session.nombre = req.query.nombre
//     req.session.contador = 1
//     res.send(`Te damos la bienvenida ${getNombreSession(req)}`)
//   }
// })

app.get('/api/logout', (req, res) => {
req.session.destroy(err => {
  if (err) {
    res.json({ error: 'logout', body: err })
  } else {
    res.redirect('http://localhost:3000/login')
  }
})
})

//********** SESSION  **********//

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

app.post("/api/products", auth, cors(), (req, res) => {
  if (req.session && req.session.user === "Lucas" && req.session.admin) {
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

app.put("/api/products/:id", auth, (req, res) => {
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

app.delete("/api/products/:id", auth, (req, res) => {
  if (req.session && req.session.user === "Lucas" && req.session.admin) {
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

//SOCKET.IO

io.on("connection", socket => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  console.log('user connected!')

  chat.list().then((list) => {
    socket.emit("messages", list );
  })


  socket.on("new-message", data => {
    chat.insert(data).then(() => {
    })
    chat.list().then((list) => {
      io.emit("messages", list );
    })
  });
});

const port = 5000;

httpServer.listen(port, () => `Server running on port ${port}`);
