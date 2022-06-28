const express = require('express');
const passport = require('passport');
const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
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

app.use(express.json());

app.use(passport.initialize());
require('./config/passport');

app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);

app.use(errorHandler);

module.exports = app;
