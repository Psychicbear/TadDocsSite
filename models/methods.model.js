import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

class Method extends Model {}

const MethodModel = Method.init(
  {
    page_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: "Page", key: "id" }
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Class", key: "page_id" }
    },
    is_static: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    return_type: DataTypes.STRING,
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true
  }
);

export { MethodModel as Method };
