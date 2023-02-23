const express = require("express");
const cors = require("cors");
const pino = require("pino");
const pinoHttp = require("pino-http");
require("dotenv").config();

const app = express();

const logger = pino({ level: "info" });
const expressLogger = pinoHttp({ logger });
// body parser midleware
app.use(express.json());
// urlencoded middleware
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://peer-assessment-frontend-3yvuhaorjq-uc.a.run.app",
      "https://peer-assessment.fl2f.ca",
    ],
    credentials: true,
  })
);

app.use("/api/login", require("./routes/userRoutes")); //working
app.use("/api/logout", require("./routes/logoutRoutes")); //working
app.use("/api/traits", require("./routes/traitRoutes")); //working
app.use("/api/members", require("./routes/members")); //working
app.use("/api/tests", require("./routes/testRoutes")); //working
app.use("/api/groups", require("./routes/groupRoutes")); //working

app.use(expressLogger);
// set up server to listen on specific port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started on port ${port}`));
