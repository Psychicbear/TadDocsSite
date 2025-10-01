import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";
import { Class } from "./classes.model.js";
import { Property } from "./properties.model.js";
import { Method } from "./methods.model.js";
import { Argument } from "./arguments.model.js";

class Page extends Model {
      // List all pages, optionally filtered by type
  static async listAll({ type } = {}) {
    const where = type ? { page_type: type } : {};
    return await this.findAll({ where, order: [["name", "ASC"]] });
  }

  // Get the root "$." page
  static async getRoot() {
    return await this.findOne({ where: { name: "$.", page_type: "class" } }, { include: [{ model: Class, as: "SubClasses" }] });
  }

  // Get a page with subtype-specific details
  static async findWithDetails(id) {
    const page = await this.findByPk(id);
    if (!page) return null;

    switch(page.page_type) {
      case "method":
        return await this.findMethodDetails(id)
      case "property":
        return await this.findPropertyDetails(id);
      case "class":
        return await this.findClassDetails(id);
    }
    return page;
  }

  // Class-specific details (methods, properties, subclasses)
  static async findClassDetails(id) {
    return await this.findByPk(id, {
      include: [
        {
          model: Class,
          as: "SubClasses",
          include: [{ model: this, as: "MainPage" }]
        },
        {
          model: Class,
          as: "MainClass",
          include: [
            { model: Property, as: "Properties", include: [{ model: this, as: "MainPage" }] },
            {
              model: Method,
              as: "Methods",
              include: [
                { model: this, as: "MainPage" },
                { model: Argument, as: "Arguments" }
              ]
            }
          ]
        }
      ],
      // Order nested Arguments by their arg_index. Use the nested path through associations.
      order: [
        [{ model: Class, as: "MainClass" }, { model: Method, as: "Methods" }, { model: Argument, as: "Arguments" }, "arg_index", "ASC"]
      ]
    });
  }


  // Property-specific details 
  static async findPropertyDetails(id) {
    return await this.findByPk(id, {
      include: [
        {model: Property, as: "MainProperty"}
      ]
    });
  }

  // Method-specific details 
  static async findMethodDetails(id) {
    return await this.findByPk(id, {
      include: [
        {model: Method, as: "MainMethod", include: [{model: Argument, as: "Arguments"}]}
      ]
    });
  }
}

const PageModel = Page.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    short_description: DataTypes.TEXT,
    long_description: DataTypes.TEXT,
    page_type: {
      type: DataTypes.ENUM("class", "method", "property"),
      allowNull: false
    },
    code_example_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  }
);

export { PageModel as Page };
