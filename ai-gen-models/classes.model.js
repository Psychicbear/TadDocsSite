import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

class Class extends Model {}

const ClassModel = Class.init(
  {
    page_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Page", key: "id" }
    },
    parent_class_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Class", key: "page_id" }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true
  }
);


export { ClassModel as Class };
