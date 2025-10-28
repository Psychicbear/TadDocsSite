import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/tools.controller.js";

const tools = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
tools.get(
    "/gif-splitter",
    expressAsyncHandler(controller.gifsplit)
);
tools.get(
    "/spritesheet-splitter",
    expressAsyncHandler(controller.spritesplit)
);

Object.freeze(tools);
export default tools;
