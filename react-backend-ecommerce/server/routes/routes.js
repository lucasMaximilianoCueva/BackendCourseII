import { Router } from "express";
import cors from 'cors';
import {
  getDataController,
  getDataByIdController,
  postDataController,
  putDataController,
  deleteDataController,
  getFakeProdsController,
  getRandomDataController,
  getInfoController,
  getDataCallbackFacebookController,
  getUserController,
  logoutFacebookController,
  getAuthFacebookController,
  registerLocalController,
  loginLocalController,
  checkoutDataController,
} from "../controller/controller.js";

const routerData = new Router();

routerData.get("/api/products", getDataController);
routerData.get("/api/products/fakeprods/:id?", cors(), getFakeProdsController);
routerData.get("/api/products/:id", cors(), getDataByIdController);
routerData.get("/api/random", getRandomDataController);
routerData.get("/api/info", getInfoController);
routerData.get("/user", getUserController);
routerData.get("/api/logout-facebook", logoutFacebookController);

routerData.get("/auth/facebook", cors(), getAuthFacebookController);
routerData.get("/auth/facebook/callback", cors(), getDataCallbackFacebookController);

routerData.post("/api/products/", postDataController);
routerData.post("/api/register", registerLocalController);
routerData.post("/api/login", loginLocalController);
routerData.post("/api/checkout", checkoutDataController);
routerData.put("/api/products/:id", putDataController);
routerData.delete("/api/products/:id", deleteDataController);

export default routerData;
