import { Router } from "express";
import { check } from "express-validator";
import { createPost, getPosts} from "./post.controller.js";
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
export default router;