import { Response, NextFunction, Request } from "express";
import Property from "../models/property.models";
import User from "../models/user.models";
import suggestProperties from "../utils/suggestProperty.utils";
import cloudinary from "../utils/cloudinary.utils";

// Create a new property
export async function createProperty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      title,
      description,
      price,
      currency,
      category,
      location,
      imageUrl
    } = req.body;
    const hostId = req.user?.id as string;

    const property = await Property.create({
      title,
      description,
      price,
      currency,
      category,
      location,
      hostId,
      imageUrl
    });

    // Update user role to 'host' if they were a renter
    if (req.user?.role === "renter") {
      await User.update({ role: "host" }, { where: { id: hostId } });
    }

    res
      .status(201)
      .json({ message: "Property created successfully", property });
    return;
  } catch (error) {
    next(error);
  }
}

// Get all properties
export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const properties = await Property.findAll({
      include: {
        model: User,
        as: "host",
        attributes: ["id", "firstName", "lastName", "email"]
      }
    });
    console.log(properties);
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// Get a single property and fetch similar suggestions
export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await Property.findByPk(id, {
      include: {
        model: User,
        as: "host",
        attributes: ["id", "firstName", "lastName", "email"]
      }
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const suggestions = await suggestProperties(property);
    res.status(200).json({ property, suggestions });
    return;
  } catch (error) {
    next(error);
  }
};

// Update a property
export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      currency,
      category,
      location,
      imageUrl
    } = req.body;
    // Update the property and return the updated record
    const [updated, [updatedProperty]] = await Property.update(
      {
        title,
        description,
        price,
        currency,
        category,
        location,
        imageUrl
      },
      { where: { id }, returning: true } // `returning: true` ensures the updated record is returned
    );

    if (!updated) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    // Return the updated property in the response
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty // Include the updated property here
    });
  } catch (error) {
    next(error);
  }
};

// Delete a property
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Property.destroy({ where: { id } });

    if (!deleted) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.status(200).json({ message: "Property deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};
