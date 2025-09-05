import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/apps.controller.js";

const apps = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
apps.get(
    "/gif-splitter",
    expressAsyncHandler(controller.gifsplit)
);
apps.get(
    "/spritesheet-splitter",
    expressAsyncHandler(controller.spritesplit)
);

Object.freeze(apps);
export default apps;
