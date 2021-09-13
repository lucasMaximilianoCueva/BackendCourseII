import mongoose from "mongoose";
import pino from "pino";
import moment from "moment";
import User from "../models/user.js";
import passport from "passport";
import twilio from "twilio";
import bcrypt from "bcrypt";
import {
  sendMailEthereal,
  sendMailGoogle
} from '../helpers/nodemailer.js' 

const logger = pino({
  prettyPrint: { colorize: true },
});

mongoose.connect(
  "mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    logger.info("mongoDB (user)");
  }
);

async function getDataCallbackFacebookController() {
  /*/------- FACEBOOK -------/*/
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

async function getAuthFacebookController(req, res) {
  /*/------- * F -------/*/
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
      avatar: req.user.avatar,
    });
  } else {
    res.json("not logged");
  }
}

async function logoutFacebookController(req, res) {
  /*/------- * F -------/*/
  const infoEthereal = await sendMailEthereal({
    to: "antoinette.stokes99@ethereal.email",
    subject: `user "${req.user.displayName}" log-out at ${moment().format(
      "DD/MM/YYYY h:mm:ss a"
    )}`,
    html: `this is an automatic message sent from node.js app`,
  });
  logger.info(infoEthereal);
  req.logout();
  res.redirect("/");
}

async function registerLocalController(req, res) {
  /*/------- LOCAL -------/*/
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
        avatar: req.body.avatar,
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
      logger.info(infoEthereal);
    }
  });
}

async function loginLocalController(req, res, next) {
  /*/------- * L -------/*/
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

    const acctSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const twilioClient = twilio(acctSid, authToken);

    const from = "whatsapp:+14155238886";
    const fromSms = "17632519090";

    const to = "whatsapp:+5491173630968";
    const toSms = "1173630968";

    const body = `Nuevo pedido de ${data.buyer.name} ${data.buyer.email}. Productos: ${data.items[0].title}(${data.items[0].quantity}`;
    const bodySms = `Hola ${data.buyer.name} ${data.buyer.surName}! el detalle de tu pedido es: ${data.items[0].title}(${data.items[0].quantity}), por un total de $${data.total}.`;

    const infoTwilioWsp = await twilioClient.messages.create({
      body,
      from,
      to,
    });
    const infoTwilioSms = await twilioClient.messages.create({
      bodySms,
      fromSms,
      toSms,
    });

    logger.info(infoTwilioWsp);
    // logger.info(infoTwilioSms)

    const infoEthereal = await sendMailEthereal({
      to: "antoinette.stokes99@ethereal.email",
      subject: `new order from: "${data.buyer.name}, email: ${data.buyer.email}"`,
      html: `Products: ${data.items[0].title}(${data.items[0].quantity}`,
    });
    logger.info(infoEthereal);

    res.json(data);
  } else {
    res.send(
      `"error" : 'does not have permissions', "description": route = '${req.url}' method = '${req.method}' not authorized`
    );
  }
}

export {
  getDataCallbackFacebookController,
  getUserController,
  logoutFacebookController,
  getAuthFacebookController,
  registerLocalController,
  loginLocalController,
  checkoutDataController,
};
