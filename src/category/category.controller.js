import Category from "./category.model.js"
import Post from "../post/post.model.js"
//import User from "../user/user.model.js"

export const getCategories = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener las categorías",
            error
        });
    }
};

export const createDefaultCategory = async () => {
    try {
        
        const categoryExists = await Category.findOne({ name: 'General' });

        if (!categoryExists) {

            const defaultCategory = new Category({
                name: 'General',  
                description: 'Categoría general para publicaciones'
            });

            await defaultCategory.save();

            console.log('Categoría predeterminada creada correctamente.');

        } else {
            console.log('La categoría predeterminada ya existe.');
        }
    } catch (error) {
        console.error('Error al crear la categoría predeterminada:', error);
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Ya existe una categoría con ese nombre."
            });
        }

        const newCategory = new Category({
            name,
            description
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: "Categoría agregada correctamente.",
            category: newCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar la categoría",
            error: error.message
        });
    }
};


export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();

        await Post.updateMany({ category: id }, { $set: { category: category._id } });

        res.status(200).json({
            success: true,
            message: "Categoría actualizada correctamente.",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la categoría",
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Buscando categoría con ID:", id);
        
        const category = await Category.findById(id);
        
        if (!category) {
            console.log("Categoría no encontrada con ID:", id);
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        console.log("Categoría encontrada, eliminando...");

       
        await Post.updateMany(
            { category: id },
            { $set: { category: null } } 
        );

        await Category.findByIdAndDelete(id);

        console.log("Categoría eliminada y publicaciones actualizadas.");

        res.status(200).json({
            success: true,
            message: "Categoría eliminada y publicaciones actualizadas exitosamente"
        });

    } catch (error) {
        console.log("Error en el proceso de eliminación:", error.message); 
        res.status(500).json({
            success: false,
            message: "Error al eliminar la categoría, intente de nuevo",
            error: error.message
        });
    }
};
