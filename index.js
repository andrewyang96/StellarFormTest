const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

const https = require('https');
const fs = require('fs');
const httpsOptions = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH)
};

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/transactions', (req, res) => {
  res.json({
    success: true,
    xdr: req.body.xdr
  });
});

const server = https.createServer(httpsOptions, app).listen(process.env.PORT, () => {
  console.log('Server running at ' + process.env.PORT);
});
