import { Page } from "./pages.model.js";
import { Class } from "./classes.model.js";
import { Property } from "./properties.model.js";
import { Method } from "./methods.model.js";
import { Argument } from "./arguments.model.js";
import { sequelize } from "./db/sqlConfig.js";
// NOTE: Do not call `sequelize.sync()` here during module import.
// Calling sync at import time (for example with `alter: true`) can
// cause Sequelize to attempt to describe/alter tables before your
// application or seed script has created them which leads to
// errors like "No description found for \"Page\" table".
//
// Sync the database explicitly from your entrypoint (e.g. app.js)
// or from your seed script so you control the timing.

// Associations
// Page <-> Class (1-to-1 and 1-to-many)
Page.hasOne(Class, { as: "MainClass", foreignKey: "page_id"});
Page.hasMany(Class, { as: "SubClasses", foreignKey: "parent_class_id" });
Class.belongsTo(Page, { as: "MainPage", foreignKey: "page_id" });
Class.belongsTo(Page, { as: "ParentClass", foreignKey: "parent_class_id" });

// Property <-> Page <-> Class
Property.belongsTo(Page, { foreignKey: "page_id", as: "MainPage" });
Property.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Property, { foreignKey: "class_id", as: "Properties" });
Page.hasOne(Property, { foreignKey: "page_id", as: "MainProperty" });

// Method <-> Page <-> Class
Method.belongsTo(Page, { foreignKey: "page_id", as: "MainPage" });
Method.belongsTo(Class, { foreignKey: "class_id", as: "ParentClass" });
Class.hasMany(Method, { foreignKey: "class_id", as: "Methods" });
Page.hasOne(Method, { foreignKey: "page_id", as: "MainMethod" });

// Argument <-> Method
Argument.belongsTo(Method, { foreignKey: "method_id", as: "ParentMethod" });
Method.hasMany(Argument, { foreignKey: "method_id", as: "Arguments" });


sequelize.sync({ alter: false });

export { Page, Class, Property, Method, Argument };
