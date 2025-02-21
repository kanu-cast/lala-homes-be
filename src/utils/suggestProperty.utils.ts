import Property from "../models/property.models";
import { Op } from "sequelize";

export default async function suggestProperties(property: Property) {
  return await Property.findAll({
    where: {
      [Op.or]: [
        { category: property.category },
        { location: { [Op.substring]: property.location } }
      ],
      id: { [Op.ne]: property.id } // we Excluding the current property
    },
    limit: 5
  });
}
