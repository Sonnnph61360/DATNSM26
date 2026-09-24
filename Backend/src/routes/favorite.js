import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorite";

const router = Router();
router.use(authRequired);
router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:fieldId", removeFavorite);

export default router;
