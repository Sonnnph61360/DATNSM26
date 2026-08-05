import { Router } from "express";
import { getCourts, addCourt, updateCourt, deleteCourt } from "../controllers/court";

const courtRouter = Router();

courtRouter.get("/", getCourts);
courtRouter.post("/", addCourt);
courtRouter.put("/:id", updateCourt);
courtRouter.delete("/:id", deleteCourt);

export default courtRouter;