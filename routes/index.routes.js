import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/index.controller.js";

const index = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
index.get(
    "/",
    expressAsyncHandler(controller.index)
);

Object.freeze(index);
export default index;
