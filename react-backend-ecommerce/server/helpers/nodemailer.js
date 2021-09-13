import nodemailer from "nodemailer";

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

export {
    sendMailEthereal,
    sendMailGoogle
}  