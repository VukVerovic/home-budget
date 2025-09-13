import { Router } from "express";
import KategorijaController from "../controllers/KategorijaController.mjs";

const router = Router();
const c = new KategorijaController();

router.get("/all", c.getAll.bind(c));
router.post("/create", c.create.bind(c));
router.post("/delete", c.delete.bind(c));

export default router;