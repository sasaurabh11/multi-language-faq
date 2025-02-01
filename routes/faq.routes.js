import express from "express";
import { getQueries, createQuery } from "../controller/faq.controller.js";

const router = express.Router();

router.route("/").get(getQueries);
router.route("/").post(createQuery);

export default router;
