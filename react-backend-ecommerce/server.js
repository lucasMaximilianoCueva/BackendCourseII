import express from "express";
import { Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import cors from "cors";
import { cartDb } from "./controller/cart.js";
import { ProductsRepository } from "./controller/ProductsRepository.js";
import { prodFaker } from "./controller/prodFaker.js";
import passport from "passport";
import passportConfig from './controller/passportConfig.js';
import { fork } from 'child_process';
import cluster from 'cluster';
import os from 'os';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import moment from 'moment';
import { Server as Socket } from 'socket.io';
import { chat } from "./controller/chat.js";
import passportLocal from './controller/passportLocal.js';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import User from './controller/user.js'
import bcrypt from 'bcrypt'
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

const numCPUs = os.cpus().length
const clusterMode = process.argv[3] == 'CLUSTER';

  if (clusterMode && cluster.isMaster) {

    logger.info(numCPUs)
  
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
  } else {
    const admin = true;
  
    const productsRepository = new ProductsRepository(5)
  
    const app = express();
    const httpServer = new HttpServer(app);
    const io = new Socket(httpServer)
    
    const PORT = process.env.PORT || 5000;
    
    httpServer.listen(PORT, err => {
      if (!err) logger.info(`Servidor express escuchando en el puerto ${PORT}`)
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
    passportLocal(passport);

    //----------------------------------------- CART ---------------------------------------------------
    
    app.get("/api/cart", cors(), (req, res) => {
      cartDb.getCart().then((list) => {
      res.json(list);
      })
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

    /// NODEMAILER ///

    // GMAIL //

      function createSendMail(mailConfig) {

        const transporter = nodemailer.createTransport(mailConfig);
      
        return async function sendMail({ to, subject, text, html, attachments }) {
          const mailOptions = { from: mailConfig.auth.user, to, subject, text, html, attachments };
          return await transporter.sendMail(mailOptions)
        }
      }
      
      function createSendMailEthereal() {
        return createSendMail({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: "antoinette.stokes99@ethereal.email",
            pass: "G6ACBVCCkME9sf1C24"
          }
        })
      }
      
      function createSendMailGoogle() {
        return createSendMail({
          service: 'gmail',
          auth: {
            user: "lukbass9@gmail.com",
            pass: "Domingo113351"
          }
        })
      }
      
      const sendMailEthereal = createSendMailEthereal()
      const sendMailGoogle = createSendMailGoogle()

    /// NODEMAILER ///
    
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
    
    // FACEBOOK //

    app.get('/auth/facebook', cors(), passport.authenticate('facebook'));
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/faillogin'
    }),
    async function(req, res) {
    const infoEthereal = await sendMailEthereal({
      to: 'antoinette.stokes99@ethereal.email',
      subject: `user "${req.user.displayName}" log-in at ${moment().format('DD/MM/YYYY h:mm:ss a')}`,
      html: `this is an automatic message sent from node.js app`
    })

          const infoGoogle = await sendMailGoogle({
            to: 'antoinette.stokes99@ethereal.email',
            subject: `user "${req.user.displayName}" log-in at ${moment().format('DD/MM/YYYY h:mm:ss a')} (Google)`,
            html: `this is an automatic message sent from node.js app`,
        attachments: [{
          path: req.user.photos[0].value
        }]
      })

    logger.info(infoEthereal)
    logger.info(infoGoogle)
      res.redirect('http://localhost:3000/');
    });
    
    app.get("/user", (req, res) => {
      if(req.user) {
        res.json({
          name: req.user.displayName || req.user.username || 'usarname',
          // photo: req.user.photos[0].value || 'user-photo',
          // email: req.user.emails[0].value || 'user-email',
          email: req.user.email,
          fname: req.user.name,
          lastname: req.user.lastname,
          adress: req.user.adress,
          age: req.user.age,
          phone: req.user.phone,
          avatar: req.user.avatar
      });
      } else {
        res.json('not logged')
      }
    });
    
    app.get('/api/logout-facebook', async (req, res) => {
      const infoEthereal = await sendMailEthereal({
        to: 'antoinette.stokes99@ethereal.email',
        subject: `user "${req.user.displayName}" log-out at ${moment().format('DD/MM/YYYY h:mm:ss a')}`,
        html: `this is an automatic message sent from node.js app`
      })
      logger.info(infoEthereal)
      req.logout();
      res.redirect('/')
      })

    // FACEBOOK //

    // LOCAL //

    mongoose.connect(
      'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        logger.info("mongoDB (user)");
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
            email: req.body.email,
            name: req.body.name,
            lastname: req.body.lastname,
            adress: req.body.adress,
            age: req.body.age,
            phone: req.body.phone,
            password: hashedPassword,
            avatar: req.body.avatar
          });
          await newUser.save();
          res.send("User Created");

          const infoEthereal = await sendMailEthereal({
            to: "antoinette.stokes99@ethereal.email",
            subject: `new register: "${newUser.username}"`,
            html: `User: '${newUser.username}' register at ${moment().format(
              "DD/MM/YYYY h:mm:ss a"
            )}`,
          });
          logger.info(infoEthereal)
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
            logger.info(req.user);
          });
        }
      })(req, res, next);
    });

    const isAuth = (req, res, next) => {
      if (req.isAuthenticated()) {
        next()
      } else {
        res.redirect('http://localhost:3000/login')
      }
    }

    //----------------------------------------- END PASSPORT ---------------------------------------------------
    // CHECKOUT

    app.post("/api/checkout", async (req, res) => {
      if (isAuth) {
        const data = req.body;

        // const acctSid = 'AC49a79e37e0435b67057646be26ab7d0d'
        // const authToken = '23c435b9378f6cc5f2d78756c1663e71'
    
        const twilioClient = twilio(acctSid, authToken)
    
        const from = 'whatsapp:+14155238886' 
        const fromSms = '17632519090'

        const to = 'whatsapp:+5491173630968'
        const toSms = '1173630968'

        const body = `Nuevo pedido de ${data.buyer.name} ${data.buyer.email}. Productos: ${data.items[0].title}(${data.items[0].quantity}`
        const bodySms = `Hola ${data.buyer.name} ${data.buyer.surName}! el detalle de tu pedido es: ${data.items[0].title}(${data.items[0].quantity}), por un total de $${data.total}.`

        const infoTwilioWsp = await twilioClient.messages.create({ body, from, to })
        const infoTwilioSms = await twilioClient.messages.create({ bodySms, fromSms, toSms })
    
        logger.info(infoTwilioWsp)
        // logger.info(infoTwilioSms)

        const infoEthereal = await sendMailEthereal({
          to: "antoinette.stokes99@ethereal.email",
          subject: `new order from: "${data.buyer.name}, email: ${data.buyer.email}"`,
          html: `Products: ${data.items[0].title}(${data.items[0].quantity}`,
        });
        logger.info(infoEthereal)

        res.json(data)
      } else {
        res.send(
          `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
        );
      }
    }); 

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
    
    //----------------------------------------- GraphQL ---------------------------------------------------
    
    var schema = buildSchema(`
      type Query {
        product(id: String): Product
        products: [Product]
      },
      type Mutation{
        postProduct(id: String): Product
      },
      type Product {
        id: String,
        title: String,
        description: String,
        timestamp: String,
        thumbnail: String,
        code: Int,
        price: Int,
        stock: Int,
      }
    `)

    var root = {
      products: () => {
        return productsRepository.list();
      },
      product: () => {
        return productsRepository.listById(id)
      },
      postProduct: () => {
        return productsRepository.insert(items)
      }
    };

    app.use('/graphql', graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }));

    //----------------------------------------- Products

    app.get("/api/products", cors(), (req, res) => {
      // productsRepository.create(); // ifNotExist
      productsRepository
        .list()
        .then((items) => {
          let response = [];
          logger.info(req.query);
    
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

    /* -------------------- Web Sockets ---------------------- */

io.on("connection", async socket => {
  socket.on("disconnect", () => {
    logger.info("user disconnected (chat)");
  });
  logger.info('user connected! (chat)')

  await chat.list().then((list) => {
    socket.emit("messages", list );
  })


  socket.on("new-message", async data => {
    chat.insert(data).then(() => {
    })
    await chat.list().then((list) => {
      io.emit("messages", list );
    })
  });
});
  /* ------------------------------------------------------- */
  }



