// models/Property.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.config";
import User from "./user.models";

interface PropertyAttributes {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  hostId: string;
}

interface PropertyCreationAttributes
  extends Optional<PropertyAttributes, "id"> {}

class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public pricePerNight!: number;
  public location!: string;
  public hostId!: string;
}

Property.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pricePerNight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" }
    }
  },
  {
    sequelize,
    tableName: "properties"
  }
);

Property.belongsTo(User, { foreignKey: "hostId", as: "host" });
User.hasMany(Property, { foreignKey: "hostId", as: "properties" });

export default Property;
