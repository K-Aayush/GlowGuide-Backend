import express from "express";

import { getDermatologist, getUser } from "../controllers/UserController";

const router = express.Router();

router.get("/dermotologist", getDermatologist);
router.get("/user", getUser);

export default router;
