import utils from "../utils/utils.js";
import notes from "../models/notes.model.js";
/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */
class Notes {
    constructor() {}
    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async list(req, res) {
        const list = await notes.list();
        return res.render("./notes/list.pug", {
            notes: list,
        });
    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async read(req, res) {
        return res.render("./notes/note.pug", {});
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async form(req, res) {
        return res.render("./notes/form.pug", {});
    }

    /**
     * Create a note based on information
     * @param {Request} req
     * @param {Response} res
     */
    async create(req, res) {
        const { title, message } = req.body;

        await notes.create(title, message);
        res.redirect("/notes");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async update(req, res) {
        const updated = await notes.update("0", { title: "new title" });
        utils.assert.not_null(updated, "Failed to update note!");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        const result = await notes.delete(user, id + "");
        if (!result) {
            return utils.pages
                .error(503)
                .title(`Failed to delete ${id}`)
                .message(`Oh no!`)
                .render(req, res);
        }
        return res.send("");
    }
}

export default new Notes();
