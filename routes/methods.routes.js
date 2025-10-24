import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/methods.controller.js";

const methods = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
methods.get(
    "/list/:parentId",
    expressAsyncHandler(controller.listMethods)
);

methods.get(
    "/view/:methodId",
    expressAsyncHandler(controller.viewMethod)
)

methods.put(
    "/addArg/:methodId",
    expressAsyncHandler(controller.addArgument)
)

Object.freeze(methods);
export default methods;