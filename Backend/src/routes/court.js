import { Router } from "express";
import { getCourts, addCourt } from "../controllers/court";

const courtRouter = Router();


courtRouter.get("/", getCourts);
courtRouter.post("/", addCourt);

export default courtRouter;