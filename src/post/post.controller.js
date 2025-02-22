import Post from "./post.model.js"
import Category from "../category/category.model.js"
import User from "../users/user.model.js"

export const getPosts = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, posts] = await Promise.all([
            Post.countDocuments(query),
            Post.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate("category", "name")
                .populate("author", "username")
        ]);

        res.status(200).json({
            success: true,
            title: "------------- Opinion Hub -------------",        
            total,
            posts: posts.map(post => ({
                id: post._id,
                title: post.title,
                category: post.category.name,
                content: post.content,
                author: post.author.username
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener las publicaciones",
            error: error.message
        });
    }
};

export const createPost = async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const postCategory = await Category.findById(data.category);
        if (!postCategory) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        const post = new Post({
            ...data,
            author: user._id
        });

        await post.save();

        res.status(200).json({
            success: true,
            post 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar la publicación",
            error: error.message
        });
    }
};
