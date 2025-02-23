import { Router } from "express";
import { check } from "express-validator";
import { createPost, getPosts, updatePost, deletePost} from "./post.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", validarJWT, getPosts);

router.post(
    "/",
    [
        validarJWT,
        validarCampos
    ],
    createPost
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updatePost
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deletePost
)

export default router;