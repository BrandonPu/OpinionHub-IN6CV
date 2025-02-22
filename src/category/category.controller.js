import Category from "./category.model.js"
//import User from "../user/user.model.js"

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
