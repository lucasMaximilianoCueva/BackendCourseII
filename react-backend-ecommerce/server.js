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
import cluster from 'cluster';
import os from 'os';
import User from './Config/user.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const numCPUs = os.cpus().length
const clusterMode = process.argv[3] == 'CLUSTER';


  if (clusterMode && cluster.isMaster) {

    console.log(numCPUs)
    console.log(`PID MASTER ${process.pid}`)
  
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
  } else {
  
    const productsRepository = new ProductsRepository(6)
  
    const app = express();
    const httpServer = new HttpServer(app);
    
    const PORT = process.env.PORT || 5000;
    
    httpServer.listen(PORT, err => {
      if (!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
    });
    
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
    
    mongoose.connect(
      'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log("mongoDB connected (user)");
      }
    );
    
    app.post("/api/register", (req, res) => {
      User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if (!doc) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });
          await newUser.save();
          res.send("User Created");
        }
      });
    });
    
    app.post("/api/login", (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");
        else {
          req.logIn(user, (err) => {
            if (err) throw err;
            res.send("Successfully Authenticated");
            console.log(req.user);
          });
        }
      })(req, res, next);
    });
    
    app.get("/user", (req, res) => {
      res.send(req.user);
    });
    
    const isAuth = (req, res, next) => {
      if (req.isAuthenticated()) {
        next()
      } else {
        res.redirect('http://localhost:3000/login')
      }
    }
    
    app.get('/api/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          res.json({ error: 'logout', body: err })
        } else {
          res.redirect('http://localhost:3000/login')
        }
      })
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
        currentFolder: process.cwd,
        cpus: numCPUs
      });
    });
    
    // RANDOMS
    
    app.get("/api/randoms", cors(), (req, res) => {
      const quantity = req.query.quan || 100000000
      const forked = fork("./Config/calc.js")
      setTimeout(() => {
        forked.send(quantity)
      }, 1000);
      forked.on("message", calc => {
        res.json({randoms: calc})
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
  }



