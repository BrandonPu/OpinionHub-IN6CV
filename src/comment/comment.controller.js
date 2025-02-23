import Comment from "./comment.model.js";
import Post from "../post/post.model.js";
import User from "../users/user.model.js";

export const createComment = async (req, res) => {
    try {
        const data = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        // Verificar si la publicación existe
        const post = await Post.findById(data.post);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        // Validar que el contenido no esté vacío
        if (!data.content || data.content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El contenido del comentario es obligatorio",
            });
        }

        // Crear y guardar el comentario
        const comment = new Comment({
            content: data.content,
            post: post._id,
            author: user._id,
        });

        await comment.save();

        // Asociar el comentario a la publicación
        post.comments = post.comments || [];
        post.comments.push(comment._id);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comentario creado correctamente",
            comment,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar el comentario",
            error: error.message,
        });
    }
};
