import utils from "../utils/utils.js";
import { Note } from "../models/notes.model.js";
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
        const list = await Note.findAll();
        return res.render("./notes/list.pug", {
            notes: list,
        });
    }

    async search(req, res) {
        const { q } = req.query;
        console.log({query: req.query});
        const notes = await Note.findLikeTitle(q);

        console.log(notes);
        return res.render("./notes/search-results.pug", { notes: notes, q: q });
    }

    /**
     *
     * @param {Request} req
     * @param {Response} res
     */
    async read(req, res) {
        const { noteId } = req.params;
        const note = await Note.findByPk(noteId);
        console.log(note)
        return res.render("./notes/note.pug", {note: note});
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
        console.log(res)
        const { title, content } = req.body;

        await Note.create({
            title: title,
            content: content,
        });
        res.redirect("/notes");
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async update(req, res) {
        const {title, content} = req.body;
        const {noteId} = req.params;
        console.log(`Updating note ${noteId} with title=${title} content=${content}`);
        const updated = await Note.updateById(noteId, {title:title,content:content});
        utils.assert.not_null(updated, `Failed to update note ${noteId}`);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    async delete(req, res) {
        const {noteId} = req.params;
        const redirect = req.query.redirect || null;
        const result = await Note.delete(noteId);
        utils.assert.not_null(result, `Failed to delete note ${noteId}`);
        if (!result) {
            return utils.pages
                .error(503)
                .title(`Failed to delete ${noteId}`)
                .message(`Oh no!`)
                .render(req, res);
        }

        if (req.get('HX-Request') && redirect) {
            res.setHeader('HX-Redirect', '/notes');
            return res.status(200).end();
        }

        return res.send("");
    }
}

export default new Notes();
