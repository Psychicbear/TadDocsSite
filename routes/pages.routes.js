import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/pages.controller.js";

const pages = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */

pages.get("/", expressAsyncHandler(controller.home));
pages.post("/upload", expressAsyncHandler(controller.upload));
pages.put("/:pageId", expressAsyncHandler(controller.editPage));
pages.delete("/:pageId", expressAsyncHandler(controller.deletePage));
pages.post("/bulkCreate", expressAsyncHandler(controller.bulkCreatePages));
pages.post("/create", expressAsyncHandler(controller.createPage));
pages.get("/create", expressAsyncHandler(controller.createPageForm));
pages.get("/:slug1", expressAsyncHandler(controller.viewPageBySlug));
pages.get("/:slug1/:slug2", expressAsyncHandler(controller.viewPageBySlug));
pages.get("/:slug1/:slug2/:slug3", expressAsyncHandler(controller.viewPageBySlug));
pages.get("/:slug1/:slug2/:slug3/:slug4", expressAsyncHandler(controller.viewPageBySlug));



Object.freeze(pages);
export default pages;
