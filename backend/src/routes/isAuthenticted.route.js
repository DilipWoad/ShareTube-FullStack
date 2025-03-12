import { Router } from "express";
import { isUserAuthenticated } from "../controllers/userAuthenticated.controller.js";


const router = Router();

router.route('/').get(isUserAuthenticated)

export default router;