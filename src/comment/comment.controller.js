import Comment from "./comment.model.js";
import Post from "../post/post.model.js";
import User from "../users/user.model.js";

export const createComment = async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        const post = await Post.findById(data.post);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        if (!data.content || data.content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El contenido del comentario es obligatorio",
            });
        }

        const comment = new Comment({
            content: data.content,
            post: post._id,
            author: user._id,
        });

        await comment.save();

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

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, ...data } = req.body;

        const comment = await Comment.findById(id).populate('author', 'username');
        
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado",
            });
        }

        if (comment.author.username !== req.usuario.username) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para actualizar este comentario por favor registrate como el usuario que hiso el comentario",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: "Comentario actualizado correctamente",
            comment: updatedComment,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el comentario",
            error: error.message,
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; 

        const comment = await Comment.findById(id).populate('author', 'username');
        
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado",
            });
        }

        if (comment.author.username !== req.usuario.username) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este comentario por favor registrate como el usuario que hiso el comentario",
            });
        }

        await Comment.findByIdAndDelete(id);

        const post = await Post.findById(comment.post);
        post.comments = post.comments.filter(c => c.toString() !== id); 
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comentario eliminado correctamente",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario",
            error: error.message,
        });
    }
};