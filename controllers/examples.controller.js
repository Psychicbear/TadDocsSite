import utils from "../utils/utils.js";
import examples from "../models/interfaces/examples.interface.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Examples {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async list(req, res) {
        const all = await examples.all();

        res.render("./snippets/view.pug", {
            snippet: all[1],
        });
        return;
    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async read(req, res) {
        const { snippetId } = req.params;
        const { pageId } = req.query;

        const target = await examples.findExampleById(snippetId);
        if (!target) {
            res.send(`404 ${snippetId} not found!`);
            return;
        }

        res.render("./pages/example/view.pug", {
            snippet: target,
            admin: req.isAdmin || false,
            page_id: pageId || null,
        });
        return;
    }
    /**
     * Route for retrieving the private code and sending it off to a running view we can import in via iframe.
     * @param {Request} req
     * @param {Response} res
     */
    async run(req, res) {
        const { snippetId } = req.params;

        const target = await examples.findExampleById(snippetId);
        if (!target) {
            res.send(`404 ${snippetId} not found!`);
            return;
        }

        res.render("./snippets/run.pug", {
            snippet: target,
        });
        return;
    }

    async fiddle(req, res) {
        const { snippetId } = req.params;

        const target = await examples.getById(snippetId);
        if (!target) {
            res.send(`404 ${snippetId} not found!`);
            return;
        }

        res.render("./snippets/fiddle.pug", {
            snippet: target,
        });
    }

    async listOptions(req, res) {
        const all = await examples.listExampleOptions();
        console.log(all)
        res.render("./pages/example/listOptions.pug", {
            examples: all,
        });
        return;
    }

    async createExample(req, res) {
        console.log(req.body)
        const newExample = await examples.createExampleForPage(req.body);
        if (!newExample) {
            res.status(500).send("Error creating new example");
            return;
        }
        return res.render("./pages/view.pug", { page: newExample });
    }

    async previewExample(req, res) {
        const { exampleId } = req.params;

        const snippet = await examples.findExampleById(exampleId);
        if (!snippet) {
            res.status(404).send("Example not found");
            return;
        }
        return res.render("./pages/example/preview.pug", { snippet: snippet });
    }

    async addExampleToPage(req, res) {
        console.log(req.body)
        const { page_id, example_id } = req.body;

        const page = await examples.addExampleToPage(example_id, page_id);
        if (!page) {
            res.status(500).send("Error adding example to page");
            return;
        }
        return res.render("./pages/view.pug", { page: page });
    }

    async removeExampleFromPage(req, res) {
        const { pageId } = req.query
        console.log("Removing example from page:", pageId)

        const page = await examples.removeExampleFromPage(pageId);
        if (!page) {
            res.status(500).send("Error removing example from page");
            return;
        }
        return res.render("./pages/view.pug", { page: page, admin: req.isAdmin || false });
    }

    async updateExample(req, res) {
        console.log("Updating example with data:", req.body);
        const { exampleId } = req.params;
        const updatedExample = await examples.updateExample(exampleId, req.body);
        if (!updatedExample) {
            res.status(500).send("Error updating example");
            return;
        }
        return res.status(200).set("HX-Trigger", "reloadExample").send();
    }

    async deleteExample(req, res) {
        const { exampleId } = req.params;
        const deleted = await examples.deleteById(exampleId);
        if (!deleted) {
            res.status(500).send("Error deleting example");
            return;
        }
        return res.send(`Example ${exampleId} deleted successfully`);
    }

    async addForm(req, res) {
        const { pageId } = req.query;
        res.render("./pages/example/add.pug", { page_id: pageId });
    }


}

//instantiate our one instance of index controller
const examples_controller = new Examples();

export default examples_controller;
