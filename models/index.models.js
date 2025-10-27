import { Page } from "./pages.model.js";
import { Class } from "./classes.model.js";
import { Property } from "./properties.model.js";
import { Method } from "./methods.model.js";
import { Argument } from "./arguments.model.js";
import { Example } from "./examples.model.js";
import { sequelize } from "./db/sqlConfig.js";


// Associations
// Page <-> Class (1-to-1 and 1-to-many)
Page.hasOne(Class, { as: "MainClass", foreignKey: "page_id", onDelete: "CASCADE", hooks: true });
Page.hasMany(Class, { as: "SubClasses", foreignKey: "parent_class_id", onDelete: "CASCADE", hooks: true });
Class.belongsTo(Page, { as: "MainPage", foreignKey: "page_id", hooks: true});
Class.belongsTo(Page, { as: "ParentClass", foreignKey: "parent_class_id" });

// Property <-> Page <-> Class
Property.belongsTo(Page, { foreignKey: "page_id", as: "MainPage", hooks: true});
Property.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Property, { foreignKey: "class_id", as: "Properties", onDelete: "CASCADE", hooks: true });
Page.hasOne(Property, { foreignKey: "page_id", as: "MainProperty", onDelete: "CASCADE", hooks: true });

// Method <-> Page <-> Class
Method.belongsTo(Page, { foreignKey: "page_id", as: "MainPage", hooks: true });
Method.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Method, { foreignKey: "class_id", as: "Methods", onDelete: "CASCADE", hooks: true });
Page.hasOne(Method, { foreignKey: "page_id", as: "MainMethod", onDelete: "CASCADE", hooks: true });

// Argument <-> Method
Argument.belongsTo(Method, { foreignKey: "method_id", as: "ParentMethod" });
Method.hasMany(Argument, { foreignKey: "method_id", as: "Arguments", onDelete: "CASCADE", hooks: true });

// Example <-> Page
Example.hasMany(Page, { foreignKey: "code_example_id", as: "CodeExample" });
Page.belongsTo(Example, { foreignKey: "code_example_id", as: "CodeExample" });

// Hooks to enable deleting page that owns Class, Property, or Method when they are deleted
Class.addHook("afterDestroy", async (cls, options) => {
    console.log("Class afterDestroy hook triggered");
  await Page.destroy({ where: { id: cls.page_id }, transaction: options.transaction, force: true });
});

Property.addHook("afterDestroy", async (prop, options) => {
    console.log("Property afterDestroy hook triggered");
  await Page.destroy({ where: { id: prop.page_id }, transaction: options.transaction, force: true });
});

Method.addHook("afterDestroy", async (method, options) => {
    console.log("Method afterDestroy hook triggered");
  await Page.destroy({ where: { id: method.page_id }, transaction: options.transaction, force: true });
});


sequelize.sync({ alter: false });

export { Page, Class, Property, Method, Argument, Example };
