import { ProductsRepository } from "../config/ProductsRepository.js";
import { cartDb } from "../config/cart.js";
import { prodFaker } from "../config/prodFaker.js";
import { fork } from "child_process";
import os from "os";
import passport from "passport";
import nodemailer from "nodemailer";
import twilio from "twilio";
import moment from "moment";
import User from "../config/user.js";
import bcrypt from 'bcrypt'
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import pino from 'pino'

const logger = pino({
    prettyPrint: { colorize: true }
  });

const option = process.argv[4] || 5

const productsRepository = new ProductsRepository(option);
const numCPUs = os.cpus().length;

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

//* GMAIL *//

function createSendMail(mailConfig) {
  const transporter = nodemailer.createTransport(mailConfig);

  return async function sendMail({ to, subject, text, html, attachments }) {
    const mailOptions = {
      from: mailConfig.auth.user,
      to,
      subject,
      text,
      html,
      attachments,
    };
    return await transporter.sendMail(mailOptions);
  };
}

function createSendMailEthereal() {
  return createSendMail({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "antoinette.stokes99@ethereal.email",
      pass: "G6ACBVCCkME9sf1C24",
    },
  });
}

function createSendMailGoogle() {
  return createSendMail({
    service: "gmail",
    auth: {
      user: "lukbass9@gmail.com",
      pass: "",
    },
  });
}

const sendMailEthereal = createSendMailEthereal();
const sendMailGoogle = createSendMailGoogle();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("http://localhost:3000/login");
  }
};

//* Routes *//

var schema = buildSchema(`
type Query {
  product(id: String): Product
  products: [Product]
},
type Mutation {
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
product: () => {
return productsRepository.listById(id)
},
products: () => {
return productsRepository.list()
},
postProduct: () => {
return productsRepository.insert(items)
}
}

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

// CART

async function getDataCartController(req, res) {
  cartDb.getCart().then((list) => {
    res.json(list);
  });
}

async function getDataCartByIdController(req, res) {
  const { id } = req.params;
  res.json(cartDb.getCartId(id));
}

async function postDataCartController(req, res) {
  if (isAuth) {
    const data = req.body;
    cartDb.postCart(data);
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

async function deleteDataCartController(req, res) {
  if (isAuth) {
    const { id } = req.params;
    res.json(cartDb.deleteCartItem(id));
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

async function getFakeProdsController(req, res) {
  const { id } = req.params;
  if (id) {
    res.json(prodFaker.listById(id));
  } else {
    prodFaker.populate(req.query.q);
    res.json(prodFaker.list());
  }
}

async function getRandomDataController(req, res) {
  const quantity = req.query.quan || 100000000;
  const forked = fork("./Config/calc.js");
  setTimeout(() => {
    forked.send(quantity);
  }, 1000);
  forked.on("message", (calc) => {
    res.json({ randoms: calc });
  });
}

async function getInfoController(req, res) {
  res.json({
    inputArguments: process.argv,
    platformName: process.platform,
    nodejsVersion: process.version,
    memoryUsage: process.memoryUsage(),
    executionPath: process.execPath,
    processId: process.pid,
    currentFolder: process.cwd,
    cpus: numCPUs,
  });
}

async function getDataCallbackFacebookController() {          /*/------- FACEBOOK -------/*/
  passport.authenticate("facebook", {
    failureRedirect: "/faillogin",
  }),
    async function (req, res) {
      const infoEthereal = await sendMailEthereal({
        to: "antoinette.stokes99@ethereal.email",
        subject: `user "${req.user.displayName}" log-in at ${moment().format(
          "DD/MM/YYYY h:mm:ss a"
        )}`,
        html: `this is an automatic message sent from node.js app`,
      });

      const infoGoogle = await sendMailGoogle({
        to: "antoinette.stokes99@ethereal.email",
        subject: `user "${req.user.displayName}" log-in at ${moment().format(
          "DD/MM/YYYY h:mm:ss a"
        )} (Google)`,
        html: `this is an automatic message sent from node.js app`,
        attachments: [
          {
            path: req.user.photos[0].value,
          },
        ],
      });

      console.log(infoEthereal);
      console.log(infoGoogle);
      res.redirect("http://localhost:3000/");
    };
}

async function getAuthFacebookController(req, res) {          /*/------- * F -------/*/
  passport.authenticate("facebook");
}

async function getUserController(req, res) {
  if (req.user) {
    res.json({
      name: req.user.displayName || req.user.username || "usarname",
      photo: "user-photo", // req.user.photos[0].value
      email: req.user.email || "user-email", // req.user.emails[0].value
      fname: req.user.name,
      lastname: req.user.lastname,
      adress: req.user.adress,
      age: req.user.age,
      phone: req.user.phone,
      avatar: req.user.avatar
    });
  } else {
    res.json("not logged");
  }
}

async function logoutFacebookController(req, res) {         /*/------- * F -------/*/
  const infoEthereal = await sendMailEthereal({
    to: 'antoinette.stokes99@ethereal.email',
    subject: `user "${req.user.displayName}" log-out at ${moment().format('DD/MM/YYYY h:mm:ss a')}`,
    html: `this is an automatic message sent from node.js app`
  })
  logger.info(infoEthereal)
  req.logout();
  res.redirect('/')
}

async function registerLocalController(req, res) {          /*/------- LOCAL -------/*/
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
}

async function loginLocalController(req, res, next) {        /*/------- * L -------/*/
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, async (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        logger.info(req.user);
      });
    }
  })(req, res, next);
}

async function checkoutDataController(req, res) {
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
}

export {
  getDataController,
  getDataByIdController,
  postDataController,
  putDataController,
  deleteDataController,
  isAuth,
  getFakeProdsController,
  getRandomDataController,
  getInfoController,
  getDataCallbackFacebookController,
  getUserController,
  logoutFacebookController,
  getAuthFacebookController,
  registerLocalController,
  loginLocalController,
  checkoutDataController,
  schema,
  root
};
