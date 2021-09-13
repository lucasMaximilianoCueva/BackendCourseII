import express from "express";
import { Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import passport from "passport";
import passportConfig from './middlewares/passport.js';
import cluster from 'cluster';
import os from 'os';
import { Server as Socket } from 'socket.io';
import { chat } from "./config/chat.js";
import passportLocal from './middlewares/passportLocal.js';
import pino from 'pino'
import { graphqlHTTP } from "express-graphql";
import routerData from "./routes/routes.js";
import { schema, root } from "./graphql/schemaGraphql.js";
import config from "./config/config.js";
import minimist from 'minimist';

const logger = pino({
  prettyPrint: { colorize: true }
});

const numCPUs = os.cpus().length
const clusterMode = config.CLUSTER_MODE == 'CLUSTER';

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

    const app = express();
    const httpServer = new HttpServer(app);
    const io = new Socket(httpServer)
    
    const args = process.argv.slice(2);
    const argsPort = minimist(args);
    const PORT = argsPort.PORT || 5000

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

    app.use(
      "/gql/api/products",
      graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
      })
    );
  
    app.use("/", routerData);
  
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



