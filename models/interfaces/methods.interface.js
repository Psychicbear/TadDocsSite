import { Class, Method, Argument } from '../index.models.js';
import { sequelize } from '../db/sqlConfig.js';

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
