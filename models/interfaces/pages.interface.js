import { Page } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js';


/*
    * Helper function to parse and generate slug based on input and parent page
*/
export function parseSlug(slug, name, parent){
    let newSlug = slug && slug.trim() !== '' ? slug.trim() : name.trim();
    newSlug = parent.slug === "/" ? parent.slug + newSlug : parent.slug + '/' + newSlug;

    return newSlug
}


/*
    * Horrific old validation function for page creation/editing from request data. 
    * To be replaced with express middleware validation in future.
*/
export function validatePageFromReq(data) {
    const { name, slug, short_desc, long_desc, page_type, parent_id } = data;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push({type: "name", msg: "Name is required and must be a non-empty string."});
    }
    if (slug && (typeof slug !== 'string' || slug.trim() === '')) {
        errors.push({type: "slug", msg: "Slug must be a non-empty string if provided."});
    }
    if (data.short_desc && (typeof short_desc !== 'string' || short_desc.trim() === '')) {
        errors.push({type: "short_desc", msg: "Short description is required and must be a non-empty string."});
    } else {let short_desc = data.short_desc || '';}

    if (!long_desc || typeof long_desc !== 'string' || long_desc.trim() === '') {
        errors.push({type: "long_desc", msg: "Long description is required and must be a non-empty string."});
    }
    if (!['class', 'method', 'property'].includes(page_type)) {
        errors.push({type: "page_type", msg: "Page type must be one of: class, method, property."});
    }
    if (!parent_id || typeof parent_id !== 'string' || parent_id.trim() === '') {
        errors.push({type: "parent_id", msg: "Parent is required and must be selected from the list."});
    }

    if(page_type === 'method') {
        const { return_type, arg_name, arg_type } = data;
        if (return_type && (typeof return_type !== 'string')) {
            errors.push({type: "return_type", msg: "Return type must be a string if provided."});
        }
        if (arg_name && (!Array.isArray(arg_name) || !arg_name.every(n => typeof n === 'string' && n.trim() !== ''))) {
            errors.push({type: "arg_name", msg: "Argument names must be an array of non-empty strings."});
        }
        if (arg_type && (!Array.isArray(arg_type) || !arg_type.every(t => typeof t === 'string' && t.trim() !== ''))) {
            errors.push({type: "arg_type", msg: "Argument types must be an array of non-empty strings."});
        }
        if ((arg_name && !arg_type) || (!arg_name && arg_type) || (arg_name && arg_type && arg_name.length !== arg_type.length)) {
            errors.push({type: "arguments", msg: "Argument names and types must be provided together and have the same length."});
        }

    } else if(page_type === 'property') {
        const { prop_type } = data;
        if (!prop_type || typeof prop_type !== 'string' || prop_type.trim() === '') {
            errors.push({type: "prop_type", msg: "Property type is required and must be a non-empty string."});
        }
    }

    const isValid = errors.length === 0;
    return { isValid, errors };
}


/*
    * Creates a new page along with its associated main model (Class/Method/Property) based on request data.
    * Uses sequelize transactions to ensure data integrity, rolling back on failure.
    * Returns the created Page instance on success, or null on failure.
*/
export async function createPageFromReq(data) {
    const t = await sequelize.transaction();
    try {
        const { name, slug, short_desc, long_desc, page_type, parent_id } = data
        const parent = await Page.findByPk(parent_id);
        if(!parent) throw new Error("Parent page not found");


        const page = await Page.create({
            name: name,
            slug: parseSlug(slug, name, parent),
            short_description: short_desc,
            long_description: long_desc,
            page_type: page_type,
        }, { transaction: t });
        if(!page) throw new Error("Failed to create page");

        let model = null;
        switch(page_type) {
            case "class":
                model = await page.createMainClass({ parent_id: parent.id }, { transaction: t }); break;
            case "property":
                model = await page.createMainProperty({ class_id: parent.id, type: data.prop_type.trim() }, { transaction: t }); break;
            case "method":
                const { return_type, arg_type, arg_name, arg_desc } = data;
                model = await page.createMainMethod({ class_id: parent.id, return_type: return_type ? return_type.trim() : null }, { transaction: t });
                if(arg_name && arg_type) {
                    let arg = null
                    for(let i = 0; i < arg_name.length; i++) {
                        arg = await model.createArgument({ name: arg_name[i].trim(), type: arg_type[i].trim(), arg_index: i , description: arg_desc[i] }, { transaction: t });
                        if(!arg) throw new Error("Failed to create argument");
                    }
                }
                break;
        }

        if(!model) { throw new Error("Failed to create main " + page_type);}
        await t.commit()
        return page;
    } catch (err) {
        console.error("Error in createPageFromReq:", err);
        await t.rollback();
        return null;
    }
}

/*
    * Handles bulk creation of pages from parsed code structure. 
    * Expects data in req.body in specific format.
    * Redirects to parent page of created pages on success.
*/
export async function bulkCreatePages(pagesData){
    const t = await sequelize.transaction();
    try {
        let parentPage = await Page.findByPk(pagesData.parent_id[0]);
        if(!parentPage) throw new Error("Parent page not found");


        for(let i = 0; i < pagesData.name.length; i++) {
            let name = pagesData.name[i];
            let type = pagesData.type[i];

            let page = await Page.create({
                name: name,
                slug: parseSlug(pagesData.slug[i], name, parentPage),
                page_type: type,
            }, { transaction: t });
            if(!page) throw new Error("Failed to create page");
            
            let model = null;
            switch(type) {
                case "property":
                    model = await page.createMainProperty({ class_id: parent.id, type: 'unknown' }, { transaction: t }); break;
                case "method":
                    model = await page.createMainMethod({ class_id: parent.id, return_type: 'void' }, { transaction: t }); break;
            }
            if(!model) { throw new Error("Failed to create main " + type);}

            return `/tad${parentPage.slug}`;
        }
    } catch (err) {
        console.error("Error in bulkCreatePages:", err);
        await t.rollback();
        return null;
    }

}

/*
    * Edits an existing page by its ID with provided data.
    * Uses sequelize transactions to ensure data integrity, rolling back on failure.
    * Returns the updated Page instance on success, or null on failure.
*/
export async function editPageById(id, data) {
    console.log("Editing page:", id, "with the following data:");
    console.log(data);
    const t = await sequelize.transaction();
    try {
        const page = await Page.findByPk(id, { transaction: t });
        if(!page) throw new Error("Page not found");

        const update = await page.update(data, { transaction: t });
        if(!update) throw new Error("Failed to update page");

        await t.commit();
        console.log("Updated page:", update);
        return update;

    } catch (err) {
        console.error("Error in editPageById:", err);
        await t.rollback();
        return null;
    }
}

/*
    * Deletes a page by its ID. NOT YET WORKING.
    * Uses sequelize transactions to ensure data integrity, rolling back on failure.
    * Returns the destroyed Page instance on success, or null on failure.
*/
export async function deletePageById(id) {
    const t = await sequelize.transaction();
    try {
        const page = await Page.findByPk(id, { transaction: t });
        if(!page) throw new Error("Page not found");

        const destroy = await page.destroy({ transaction: t });
        if(!destroy) throw new Error("Failed to delete page");

        await t.commit();
        return destroy;
    } catch (err) {
        console.error("Error in deletePageById:", err);
        await t.rollback();
        return null;
    }

}