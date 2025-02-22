import { Router } from "express";
import { check } from "express-validator";
import { createCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarCampos
    ],
    createCategory
)
export default router;