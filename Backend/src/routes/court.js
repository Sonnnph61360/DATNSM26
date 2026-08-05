import { Router } from "express";
import { getCourts, addCourt } from "../controllers/Court";

const courtRouter = Router();


courtRouter.get("/", getCourts);
courtRouter.post("/", addCourt);

export default courtRouter;