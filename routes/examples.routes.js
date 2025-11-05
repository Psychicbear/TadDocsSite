import express from "express";
import expressAsyncHandler from "express-async-handler";
import controller from "../controllers/examples.controller.js";

const examples = express.Router();
/**
 * We define our route paths here, including middleware usage, our controllers are only responsible for the last bit logic and then routing to view.
 */
examples.get(
    "/",
    expressAsyncHandler(controller.read)
);

examples.get(
    "/list-options",
    expressAsyncHandler(controller.listOptions)
);

examples.get(
    "/preview/:exampleId",
    expressAsyncHandler(controller.previewExample)
);
examples.get(
    "/preview/:exampleId",
    expressAsyncHandler(controller.previewExample)
);

examples.get(
    "/add",
    expressAsyncHandler(controller.addForm)
);

examples.post(
    "/addNew",
    expressAsyncHandler(controller.createExample)
);

examples.post(
    "/addExisting",
    expressAsyncHandler(controller.addExampleToPage)
);

examples.put(
    "/remove",
    expressAsyncHandler(controller.removeExampleFromPage)
);

examples.put(
    "/:exampleId",
    expressAsyncHandler(controller.updateExample)
);

examples.delete(
    "/:exampleId",
    expressAsyncHandler(controller.deleteExample)
);

examples.get(
    "/:snippetId",
    expressAsyncHandler(controller.read)
);

examples.get(
    "/:snippetId/run",
    expressAsyncHandler(controller.run)
);

examples.get(
    "/:snippetId/fiddle",
    expressAsyncHandler(controller.fiddle)
);

Object.freeze(examples);
export default examples;
