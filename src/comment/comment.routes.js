import { Router } from "express";
import { check } from "express-validator";
import { createComment } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarCampos,
    ],
    createComment
);

export default router;