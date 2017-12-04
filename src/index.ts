import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as cors from "cors";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as redis from "connect-redis";
import * as cookieParser from "cookie-parser";
import config from "./config";
import initializeDb, { Db } from "./db/initializeDb";
import HomeController from "./controllers/auth.controller";
import { authMiddle, apiMiddle, htmlMiddle } from "./middlewares";
import routers from "./routers/";
import { log } from "./utils/common";
import sockets from "./sockets";

const app = express();

// const RedisStore = require("connect-redis")(session);

// enable cors request
app.use(
  cors({
    // exposedHeaders: config.corsHeaders,
    credentials: true
  })
);

// set public path
app.use(express.static(path.resolve(__dirname, "../public")));
// set views
app.set("views", path.resolve(__dirname, "views"));
// logger
app.use(morgan("dev"));
// 3rd party middleware

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
// cookie middleware must before session middleware
// app.use(cookieParser(config.session_secret));

// app.use(
//   session({
//     secret: config.session_secret,
//     store: new RedisStore(config.redis),
//     resave: false,
//     saveUninitialized: false
//   })
// );

initializeDb((db: Db) => {
  // check user login status
  // app.use(authMiddle(db));

  // register define api
  routers(app, db);

  // call other service's api
  // app.use(apiMiddle());

  // app.use(htmlMiddle());
});

const server = http.createServer(app);

sockets(server);

server.listen(config.port || 8888, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
