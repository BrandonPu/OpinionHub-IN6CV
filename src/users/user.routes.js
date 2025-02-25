import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUser, changeRole } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarJWTADMIN } from "../middlewares/validar-jwt-admin.js";

const router = Router();

router.get("/", getUsers);

router.put(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos,
        validarJWT
    ],
    updateUser
)

router.put(
    "/:id/role",
    [
        validarJWTADMIN,
        validarCampos
    ],
    changeRole
)
export default router;