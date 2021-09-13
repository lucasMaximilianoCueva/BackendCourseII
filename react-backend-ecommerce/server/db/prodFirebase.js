import admin from 'firebase-admin';
import moment from 'moment';
import pino from 'pino'

const logger = pino();

const firebaseConfig = {
    "type": process.env.FIREBASE_API_TYPE,
    "project_id": process.env.FIREBASE_API_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_API_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_API_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_API_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_API_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_API_AUTH_URI,
    "token_uri": process.env.FIREBASE_API_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_API_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_API_CLIENT_CERT
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export class ProductsDB {
    constructor() {
        this.db = admin.firestore();
        this.prodCollection = this.db.collection('items');
        this.doc = this.prodCollection.doc()
        this.nextProdDb = 0;
        this.timeStamp = moment().format('DD/MM/YYYY h:mm:ss a');
        this.codeProd = Math.round(Math.random()*10000); 
    }

    async list() {
        const query = await this.prodCollection.get();
        const res = query.docs.map(d => {
            return d.data();
        })
        return res;
    };

    async listById(id) {
        const query = await this.prodCollection.doc(id).get();
        const res = query.data();
        return res;
    };

    insert(items) {
        const newProd = { ...items, _id: this.doc.id, timestamp: this.timeStamp, code:this.codeProd };
        return this.doc.create(newProd);
    };

    async updateById(id, data) {
        const query = await this.prodCollection.doc(id);
        const res = query.update(data);
        return res;
    };

    async deleteById(id) {
        const query = await this.prodCollection.doc(id);
        const res = query.delete();
        return res;
    };
};

const prodFirestore = new ProductsDB();

export { prodFirestore };