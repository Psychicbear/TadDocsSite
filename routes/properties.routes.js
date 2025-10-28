import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/properties.controller.js";

const props = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
props.get("/view/:propId", expressAsyncHandler(controller.viewProp));
props.get("/list/:parentId", expressAsyncHandler(controller.listProps));
props.put("/:propId", expressAsyncHandler(controller.editProp));
props.post("/:parentId", expressAsyncHandler(controller.createProp));
props.delete("/:propId", expressAsyncHandler(controller.deleteProp));

Object.freeze(props);
export default props;