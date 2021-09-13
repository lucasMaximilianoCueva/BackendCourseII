import twilio from "twilio";

const acctSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(acctSid, authToken);

const from = "whatsapp:+14155238886";
const fromSms = "17632519090";

const to = "whatsapp:+5491173630968";
const toSms = "1173630968";

const body = `Nuevo pedido de ${data.buyer.name} ${data.buyer.email}. Productos: ${data.items[0].title}(${data.items[0].quantity}`;
const bodySms = `Hola ${data.buyer.name} ${data.buyer.surName}! el detalle de tu pedido es: ${data.items[0].title}(${data.items[0].quantity}), por un total de $${data.total}.`;

async function twilioWsp(body) {
  try {
    await twilioClient.messages.create({ body, from, to });
  } catch (error) {
    console.log(error);
  }
}

export { twilioWsp }