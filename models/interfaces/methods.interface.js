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
                rejectOnEmpty: true,
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