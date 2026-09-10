require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoute = require('./routes/product');
const vendorRoute = require('./routes/vendor');
const saleRoute = require('./routes/sale');
const purchaseRoute = require('./routes/purchase');

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', productRoute);
app.use('/', vendorRoute);
app.use('/', saleRoute);
app.use('/', purchaseRoute);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
