const db = require('./config/database');
const app = require('./app');

db.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.log('Unable to connect to the database:' + err));

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
