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

methods.get(
    "/add/:parentId",
    expressAsyncHandler(controller.addMethodForm)
)


methods.post(
    "/",
    expressAsyncHandler(controller.createMethod)
)

methods.post(
    "/:methodId/args/add",
    expressAsyncHandler(controller.addArgument)
)

methods.put(
    "/:methodId",
    expressAsyncHandler(controller.editMethod)
)
methods.put(
    "/:methodId/args/:argId",
    expressAsyncHandler(controller.editMethodArg)
)

methods.delete(
    "/:methodId",
    expressAsyncHandler(controller.deleteMethod)
);
methods.delete(
    "/:methodId/args/:argId",
    expressAsyncHandler(controller.deleteMethodArg)
);



Object.freeze(methods);
export default methods;