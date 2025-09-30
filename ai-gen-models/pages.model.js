import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";
import { Class } from "./classes.model.js";
import { Method } from "./methods.model.js";
import { Property } from "./properties.model.js";
import { Argument } from "./arguments.model.js";

class Page extends Model {
      // List all pages, optionally filtered by type
  static async listAll({ type } = {}) {
    const where = type ? { page_type: type } : {};
    return await this.findAll({ where, order: [["name", "ASC"]] });
  }

  // Get the root "$." page
  static async getRoot() {
    return await this.findOne({ where: { name: "$.", page_type: "class" } });
  }

  // Get a page with subtype-specific details
  static async findWithDetails(id) {
    const page = await this.findByPk(id);
    if (!page) return null;

    if (page.page_type === "class") {
      return await this.findClassDetails(id);
    }
    if (page.page_type === "method") {
      return await this.findMethodDetails(id);
    }
    if (page.page_type === "property") {
      return await this.findPropertyDetails(id);
    }

    return page;
  }

  // Class-specific details (methods, properties, subclasses)
  static async findClassDetails(id) {
    return await this.findByPk(id, {
      include: [
        {
          model: Class,
          include: [
            {
              model: Method,
              include: [
                { model: Argument },
                { model: Page, as: "methodPage" }
              ]
            },
            {
              model: Property,
              include: [{ model: Page, as: "propertyPage" }]
            }
          ]
        }
      ]
    });
  }

  // Method-specific details
  static async findMethodDetails(id) {
    return await this.findByPk(id, {
      include: [
        {
          model: Method,
          include: [Argument]
        }
      ]
    });
  }

  // Property-specific details
  static async findPropertyDetails(id) {
    return await this.findByPk(id, {
      include: [
        {
          model: Property
        }
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
