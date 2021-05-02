import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});
const send = async (mailInfo) => {
  try {
    let info = await transporter.sendMail(mailInfo);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error);
  }
  // send mail with defined transport object
};

export const emailProcessor = ({ type, otp, email }) => {
  const info = {
    from: `kakhaga shop <${process.env.EMAIL_USER}>`, // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };
  switch (type) {
    case "OTP_REQUEST":
      info = {
        to: email, // list of receivers

        subject: "OTP for your password reset", // Subject line
        text: `Hi, here is the OTP for your password reset, ${otp} this token will expire in 1 day`, // plain text body
        html: `<div><p>Hello there</p>
        <p>here is the OTP password reset</p>
        <p>${otp}</p>
        <p>regards,</p>
        </div>
        `,
      };
      send(info);

      break;

    case "UPDAT_PASS_SUCCESS":
      info = {};
      send(info);

      break;

    default:
      break;
  }
};
