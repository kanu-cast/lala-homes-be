// models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.config";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  role: "renter" | "host";
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: "renter" | "host";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM("renter", "host"),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "users"
  }
);

export default User;
