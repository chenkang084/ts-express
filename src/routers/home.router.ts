import * as express from "express";
import HomeController from "../controllers/home";
import { Db } from "../db/initializeDb";
import { Express, Router, Request, Response } from "express";

export default (app: Express, db?: Db) => {
  const homeController = new HomeController(app, db);

  const router = express.Router();
  router.get("/test", homeController.test);

  // Apply the routes to our application with the prefix /api
  app.use("/home", router);
};
