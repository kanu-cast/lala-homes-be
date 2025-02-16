// models/Booking.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.config";
import User from "./user.models";
import Property from "./property.models";

interface BookingAttributes {
  id: string;
  renterId: string;
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  status: "pending" | "confirmed" | "canceled";
}

interface BookingCreationAttributes extends Optional<BookingAttributes, "id"> {}

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: string;
  public renterId!: string;
  public propertyId!: string;
  public checkIn!: Date;
  public checkOut!: Date;
  public status!: "pending" | "confirmed" | "canceled";
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" }
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "properties", key: "id" }
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "canceled"),
      allowNull: false,
      defaultValue: "pending"
    }
  },
  {
    sequelize,
    tableName: "bookings"
  }
);

Booking.belongsTo(User, { foreignKey: "renterId", as: "renter" });
User.hasMany(Booking, { foreignKey: "renterId", as: "bookings" });

Booking.belongsTo(Property, { foreignKey: "propertyId", as: "property" });
Property.hasMany(Booking, { foreignKey: "propertyId", as: "bookings" });

export default Booking;
