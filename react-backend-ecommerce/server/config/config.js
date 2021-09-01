import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});

export default {
    NODE_ENV: process.env.NODE_ENV,
    DB: process.env.DB,
    HOST: process.env.HOST,
    PORT:process.env.PORT,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLUSTER_MODE: process.env.CLUSTER_MODE
}