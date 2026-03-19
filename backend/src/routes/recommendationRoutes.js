import express from "express";
import { getPersonalizedRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();
router.get("/:userId", getPersonalizedRecommendations);

export default router;