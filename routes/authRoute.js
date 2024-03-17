import { Router } from "express";
import { conseguirUsuarios, crearUsuario, loginUser, logout } from "../controllers/user.js";


const router = Router();


router.get("/", conseguirUsuarios);

router.post("/register", crearUsuario);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;