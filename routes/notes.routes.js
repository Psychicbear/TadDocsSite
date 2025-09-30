import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/notes.controller.js";

const notes = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
notes.get(
    "/search",
    expressAsyncHandler(controller.search)
);
notes.get(
    "/",
    expressAsyncHandler(controller.list)
);
// notes.get(
//     "/create",
//     expressAsyncHandler(controller.form)
// );
notes.get("/:noteId", expressAsyncHandler(controller.read));
notes.post("/", expressAsyncHandler(controller.create));
notes.put("/:noteId", expressAsyncHandler(controller.update));
notes.delete("/:noteId", expressAsyncHandler(controller.delete));


Object.freeze(notes);
export default notes;
