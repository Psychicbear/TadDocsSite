import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/properties.controller.js";

const properties = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
// apps.get(
//     "/list/:parentId",
//     expressAsyncHandler(controller.listSubproperties)
// );

Object.freeze(properties);
export default properties;