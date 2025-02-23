import { Router } from "express";
import { check } from "express-validator";
import { createCategory, updateCategory, deleteCategory} from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateRole } from "../middlewares/validar-role.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

router.post(
    "/",
    [
        validarJWTADMIN,
        validarCampos
    ],
    createCategory
)

router.put(
    "/:id",
    [
        validarJWTADMIN,
        validarCampos
    ],
    updateCategory
)

router.delete(
    "/:id",
    [
        validarJWTADMIN,
        check("id", "No es un ID valido").isMongoId(),
        validarCampos
    ],
    deleteCategory
)

export default router;