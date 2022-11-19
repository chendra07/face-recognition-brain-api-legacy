const https = require("https");
const app = require("./app");
const server = https.createServer(app);
require("dotenv").config();

const PORT = process.env.PORT || 2000;

async function startServer() {
  //add async await function if server need to connect
  //another DB or load data first

  server.listen(PORT, () => {
    console.log("App is running on: ", PORT);
  });
}

startServer();
