import { Router } from "express";
import TransakcijaController from "../controllers/TransakcijaController.mjs";

const router = Router();
const t = new TransakcijaController();

router.get("/all", t.getAll.bind(t));
router.post("/create", t.create.bind(t));
router.post("/delete", t.delete.bind(t));

export default router;