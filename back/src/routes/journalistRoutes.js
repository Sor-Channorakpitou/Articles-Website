import { Router } from "express";
import { getArticlesByJournalist } from "../controllers/articleController.js";

const journalistRouter = Router();
journalistRouter.get("/:id/articles", getArticlesByJournalist);

export default journalistRouter;
