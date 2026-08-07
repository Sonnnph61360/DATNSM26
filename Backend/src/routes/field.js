import { Router } from "express";
import {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
} from "../controllers/field";

const router = Router();
router.get("/", getFields);
router.get("/:id", getField);
router.post("/", createField);
router.put("/:id", updateField);
router.patch("/:id", updateField);
router.delete("/:id", deleteField);

export default router;
