// server start krna
// db connect krna
const app = require("./src/app");
const connect = require("./src/db/db");

connect();
require('dotenv').config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
