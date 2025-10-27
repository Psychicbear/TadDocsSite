import { parseCode } from "../utils/utils.parse-lib.mjs";
import { sequelize } from "../models/db/sqlConfig.js";
import { Page } from "../models/index.models.js";
import { validatePageFromReq, createPageFromReq, deletePageById, bulkCreatePages, editPageById } from "../models/interfaces/pages.interface.js";
import { authCheck } from "../utils/utils.auth.js";

/**
 * @typedef {import('../utils/types.mjs').OurRequest} Request
 * @typedef {import('../utils/types.mjs').ExpressResponse} Response
 */

class Index {
    constructor() {} //generally the constructor is going to be empty since we don't really want our controller calls sharing state if we can avoid it.


    /**
     *
     * @param {Request} req
     * @param {Response} res
     * Renders the top level of the Tad documentation
     */
    async home(req, res) {
        let edit = false
        if(req.isAdmin && req.query.editmode) edit = true
        const root = await Page.getRoot();

        if(req.get('HX-Request')) {
            return res.render("./pages/view.pug", { page: root, admin: req.isAdmin, edit, loadPageType: true });
        } else {
            res.render("./pages/layout.pug", { page: root, admin: req.isAdmin, edit, loadPageType: false } );
        }
    }

    /*
        * Lists pages. I don't think this is currently used anywhere.
    */
    async listPages(req, res) {
        const pages = await Page.listAll({ type: req.query.type });
        res.render("./pages/list.pug", { pages, admin: req.isAdmin });
    }

    /*
        * Views a page by its ID. Renders 404 if not found. Backup method for viewing pages.
    */
    async viewPage(req, res) {
        const page = await Page.findByPk(req.params.pageId);
        if (!page) return res.status(404).send("Page not found");
        res.render("./pages/view.pug", { page, admin: req.isAdmin });
    }

    /*
        * Serves the new page form which allows creating any type of page at any location in site. Will be changed to a more specific page type creation in future.
    */
    async createPageForm(req, res) {
        if(!authCheck(req,res)) return;
        const modules = await Page.listAll({ type: "class" });
        const parsed = modules.map(m => {
            let relName = ''
            if(m.slug == '/'){
                relName = '$'
            } else {
                relName = '$' + m.slug.replace(/\//g, '.')
            }
            return { name: m.name, slug: relName, id: m.id }
        })
        res.render("./pages/createAny.pug", { pages: parsed, admin: req.isAdmin });
    }
    

    /*
        * Handles creating a new page of any type at any location in site. 
        * Validates input and redirects to created page on success. 
        * Validation to be switched to express middleware in future.
    */
    async createPage(req, res) {
        if(!authCheck(req,res)) return;
        let newPage = null;
        try {
            let {isValid, errors} = validatePageFromReq(req.body);
            if(!isValid) {
                throw Error("Validation failed due to the following errors: " + JSON.stringify(errors));
            } else{
                newPage = await createPageFromReq(req.body);
                if(!newPage) throw Error("Failed to create page");;
            }
        } catch (err) {
            console.error("Error creating page:", err);
            return res.status(500).send("Internal Server Error");
        }
        return res.redirect(`/tad${newPage.slug}`);
    }

    /*
        * Handles bulk creation of pages from parsed code structure. 
        * Expects data in req.body in specific format.
        * Redirects to parent page of created pages on success.
    */
    async bulkCreatePages(req, res) {
        if(!authCheck(req,res)) return;
        let redir = await bulkCreatePages(req.body)
        return res.redirect(redir);
    }

    /*
        * Views a page by its slug, supporting up to 4 levels of slugs. 
        * Renders 404 if page not found.
    */
    async viewPageBySlug(req, res) {
        let edit = false
        if(req.isAdmin && req.query.editmode) edit = true
        let slug = ''
        slug += req.params.slug1 ? `/${req.params.slug1}` : ''
        slug += req.params.slug2 ? `/${req.params.slug2}` : ''
        slug += req.params.slug3 ? `/${req.params.slug3}` : ''
        slug += req.params.slug4 ? `/${req.params.slug4}` : ''

        const page = await Page.getBySlug(slug);
        if (!page) return res.status(404).send("Page not found");
        if(req.get('HX-Request')) {
            return res.render("./pages/view.pug", { page, admin: req.isAdmin, edit, loadPageType: true });
        } else {
            res.render("./pages/layout.pug", { page, admin: req.isAdmin, edit, loadPageType: false } );
        }
    }

    /*
        * Handles editing an existing page. 
        * Expects pageId in req.params and updated data in req.body.
        * Redirects to top level on site. THIS MUST BE CHANGED ASAP.
    */
    async editPage(req, res) {
        if(!authCheck(req,res)) return;
        const pageId = req.params.pageId;
        const data = req.body;
        let newdata = await editPageById(pageId, data);
        // return res.redirect(`/tad/${data.slug}`);
        if(req.query.refertype == 'class' && req.query.id){
            // return res.status(200).set('HX-Redirect',`/classes/view/${req.query.id}`);
            return res.status(200).set('HX-Trigger', {"load": {"target": ".type-details"}})
        } else{
            return res.render("./pages/view.pug", { page: newdata, admin: req.isAdmin });
        }
    }

    /*
        * Handles deleting a page by its ID. 
        * Expects pageId in req.params.
        * Redirects to top level of docs on success.
    */
    async deletePage(req, res) {
        if(!authCheck(req,res)) return;
        console.log("Deleting page with ID:", req.params.pageId);
        const pageId = req.params.pageId;
        let deleted = await deletePageById(pageId);
        if(!deleted) {
            return res.status(500).send("Failed to delete page");
        }
        return res.status(200).set('HX-Trigger', 'loadParent')
    }

    /*
        * Handles uploading and parsing bulk page data from file content.
        * Expects parent_id and filecontent in req.body.
        * Renders confirmation form with parsed data.
    */
    async upload(req, res){
        if(!authCheck(req,res)) return;
        const {parent_id, filecontent} = req.body
        if(!filecontent) return res.status(400).send("No file content provided");
        if(!parent_id) return res.status(400).send("No parent id provided");
        let data = parseCode(req.body.filecontent)
        console.log(data)
        res.render("./pages/confirmBulk.pug", { data, parent_id, admin: req.isAdmin });
    }
}

//instantiate our one instance of index controller
const index_controller = new Index();

export default index_controller;
