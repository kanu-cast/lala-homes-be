// models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.config";

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  email: string;
  password?: string;
  avatar?: string;
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
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public avatar!: string;
  public googleId!: string;
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM("renter", "host"),
      allowNull: false,
      defaultValue: "renter"
    }
  },
  {
    sequelize,
    tableName: "users"
  }
);

export default User;
