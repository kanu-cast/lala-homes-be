import { Router } from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty
} from "../controllers/property.controllers";
import { isAuthenticated, isOwner } from "../middlewares/auth.middlewares";
import { propertyValidation } from "../middlewares/validators.middlewares";
import { validate } from "../middlewares/validate.middlewares";
import upload from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  propertyValidation,
  validate,
  upload.single("image"),
  createProperty
);
router.get("/", getProperties);
router.get("/:id", getProperty);
router.put(
  "/:id",
  isAuthenticated,
  isOwner,
  propertyValidation,
  validate,
  upload.single("image"),
  updateProperty
);
router.delete("/:id", isAuthenticated, isOwner, deleteProperty);

export default router;
