import Category from "./category.model.js"

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
