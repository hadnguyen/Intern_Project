const express = require('express');
const passport = require('passport');
const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
const itemRoute = require('./routes/item.route');
const mediaRoute = require('./routes/media.route');
const voucherRoute = require('./routes/voucher.route');
const errorHandler = require('./middlewares/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'VMO-Project API',
      version: '1.0.0',
      description: 'API Information',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000',
      },
    ],
  },

  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
require('./config/passport');

app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/items', itemRoute);
app.use('/api/v1/medias', mediaRoute);
app.use('/api/v1/vouchers', voucherRoute);

app.use(errorHandler);

module.exports = app;
