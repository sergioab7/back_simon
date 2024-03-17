import { Router } from "express";
import { addNuevaPuntuacion, dashboard, ranking } from "../controllers/tareas";

const router = Router();

router.get("/dashboard", dashboard);
router.get("/ranking/:limit?", ranking);
router.post("/nueva-puntuacion", addNuevaPuntuacion);



export default router;