import mongoose from "mongoose"
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

const Schema = mongoose.Schema

export class ChatDB {
  constructor() {
    this.url = 'mongodb+srv://reactExpressDB:42707519@cluster0.7ezer.mongodb.net/ecommerce?retryWrites=true&w=majority';

    this.chatSchema = new Schema({
      author: String,
      time: String,
      text: String,
    });

    this.chatDAO = mongoose.model("messages", this.chatSchema);

  //   mongoose.createConnection(
  //     this.url,
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true,
  //     }).then(() => {
  //       logger.info('chat connected to the base')
  //     }).catch(err => logger.error( err ));

  mongoose
  .connect(this.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => {
    logger.info(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

}
 
   insert(items) {
    return this.chatDAO.create(items)
  }
  async list() {
    return await this.chatDAO.find({});
  }
}

const chat = new ChatDB();

export { chat };