import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/pages.controller.js";

const pages = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
pages.get(
    "/",
    expressAsyncHandler(controller.home)
);
// pages.get(
//     "/create",
//     expressAsyncHandler(controller.form)
// );
pages.get("/:pageId", expressAsyncHandler(controller.viewPage));


Object.freeze(pages);
export default pages;
