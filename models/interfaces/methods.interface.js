import { Class, Method, Argument, Page } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js';
import { parseSlug } from './pages.interface.js';

export async function listMethodsById(parentId){
    try {
        const parent = await Class.findByPk(parentId, {
            attributes: [],
            include: [{
                    association: "Methods",
                    attributes: ['page_id', 'return_type'],
                    include: [{
                        association: "MainPage", 
                        attributes: ['name', 'short_description', 'slug']
                    }]
                },
            ],
            nest: true,
            rejectOnEmpty: true,
        });

        let methods = parent.Methods.map(async method => {
            let args = await Argument.findAll({
                where: { method_id: method.page_id },
                attributes: ['id', 'name', 'type', 'description', 'arg_index'],
                order: [['arg_index', 'ASC']],
                raw: true,
                rejectOnEmpty: false,
            })
            let newMethod = {
                page_id: method.page_id,
                name: method.MainPage.name,
                short_description: method.MainPage.short_description,
                slug: method.MainPage.slug,
                returns: method.return_type,
                args: args
            }
            return newMethod;
        })
        methods = await Promise.all(methods);
        return methods;
    } catch (error) {
        console.error("Error in listSubclasses:", error);
        return null;
    }
}

export async function getMethodDetails(methodId){
    try {
        const args = await Argument.findAll({
            where: { method_id: methodId },
            attributes: ['id', 'name', 'type', 'description', 'arg_index'],
            order: [['arg_index', 'ASC']],
            raw: true,
            rejectOnEmpty: false,
        });
        console.log(args)
        const returns = await Method.findByPk(methodId, {
            attributes: ['return_type'],
            raw: true,
            rejectOnEmpty: false,
        });
        return { args, returns: returns.return_type };
    } catch (error) {
        console.error("Error in getArgsByMethodId:", error);
        return null;
    }
}

export async function editMethodById(methodId, data){
    const t = await sequelize.transaction();
    try {
        const method = await Method.findByPk(methodId,{
            rejectOnEmpty: true,
            transaction: t
        });
        if(data.return_type) method.return_type = data.return_type;
        await method.save({transaction: t});
        await t.commit();
        return method;
    } catch (error) {
        await t.rollback();
        console.error("Error in editMethodById:", error);
        return null;
    }
}

export async function editMethodArgById(argId, data){
    const t = await sequelize.transaction();
    try {
        const arg = await Argument.findByPk(argId,{
            rejectOnEmpty: true,
            transaction: t
        });
        if(data.name) arg.name = data.name;
        if(data.type) arg.type = data.type;
        if(data.description) arg.description = data.description;
        await arg.save({transaction: t});
        await t.commit();
        return arg;
    } catch (error) {
        await t.rollback();
        console.error("Error in editMethodArgById:", error);
        return null;
    }
}

export async function createMethod(data) {
    const t = await sequelize.transaction();
    try {
        const { name, page_type, parent_id } = data

        const page = await Page.create({
            name: name,
            page_type: page_type,
        }, { transaction: t });
        if(!page) throw new Error("Failed to create page");

        if(data.slug) page.slug = data.slug;
        else page.slug = parseSlug(name, name, parent);

        if(data.short_desc) page.short_description = data.short_desc;
        if(data.long_desc) page.long_description = data.long_desc;

        await page.save({ transaction: t });

        const model = await page.createMainMethod({ class_id: parent_id }, { transaction: t });
        if(data.return_type) {
            model.return_type = data.return_type;
            await model.save({ transaction: t });
        }

        if(!model) { throw new Error("Failed to create main " + page_type);}
        await t.commit()
        return page;
    } catch (err) {
        console.error(`Error in creating method ${data.name}:  ${err}`);
        await t.rollback();
        return null;
    }
}

export async function deleteMethodById(methodId) {
    const t = await sequelize.transaction();
    try {
        const method = await Method.findOne({ where: { page_id: methodId }, transaction: t });
        if(!method) throw new Error("Method not found");

        await method.destroy({ transaction: t, force: true });

        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        console.error("Error in deleteMethodById:", error);
        return false;
    }
}