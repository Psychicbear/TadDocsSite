import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/classes.controller.js";

const classes = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
classes.get("/view/:classId", expressAsyncHandler(controller.viewClass))
classes.get("/list/:parentId", expressAsyncHandler(controller.listSubclasses));
classes.post("/:parentId", expressAsyncHandler(controller.createClass));
classes.put("/:classId", expressAsyncHandler(controller.editClass));
classes.delete("/:classId", expressAsyncHandler(controller.deleteClass));

Object.freeze(classes);
export default classes;
