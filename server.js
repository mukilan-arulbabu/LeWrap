const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;


const generated = [];
const generateCode = (length) => {
  try {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (generated.indexOf(text) === -1) {
      generated.push(text);
    } else {
      generateCode();
    }
    return generated;
  } catch (err) {
    console.log(err);
  }
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lewrapfactorie@gmail.com',
    pass: 'dk@123456',
  },
});

app.use(express.static(__dirname));
app.use(bodyParser.json({
  limit: '50mb',
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.post('/sendMail', (req, res) => {
  const mailfrom = req.body.email;
  const subject = `${req.body.firstName} ${req.body.lastName} - ${req.body.mobile}`;
  const bodyData = `${mailfrom} - ${req.body.comments}`;
  const mailOptions = {
    from: 'lewrapfactorie@gmail.com',
    to: 'lewrapfactorie@gmail.com',
    subject,
    text: bodyData,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send('error');
      console.log(error);
    } else {
      res.send('sent');
      console.log(`Email sent: ${info.response}`);
    }
  });
});


app.listen(PORT);
console.log('app is running no issues;');
