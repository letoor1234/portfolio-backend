require("dotenv").config();

const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");

const app = require("express")();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

app.post("/mail-to", async (req, res) => {
  console.log("request send mail");
  const mail = req.body;
  console.log("mail data");
  console.log(mail);
  ejs.renderFile(
    path.join(__dirname, "./views/template.ejs"),
    { mail },
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "Contacto de Landing Page",
        html: data,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        return res.status(200).json({
          message: `Correo enviado con éxito!`,
        });
      });
    }
  );
});

app.listen(process.env.PORT, () => console.log("Server listening!"));
