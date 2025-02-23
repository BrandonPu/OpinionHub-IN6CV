import { Router } from "express";
import { check } from "express-validator";
import { createComment, updateComment, deleteComment } from "./comment.controller.js";
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

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
    ],
    updateComment
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos,
    ],
    deleteComment
);

export default router;