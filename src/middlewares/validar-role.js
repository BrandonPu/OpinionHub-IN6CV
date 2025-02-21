export const validateRole = (requiredRole) => {
    return (req, res, next) => {
        try {

            if (req.user && req.user.role === requiredRole) {
                return next();
            }

            return res.status(403).json({
                message: `Acción no permitida. Solo los usuarios con el rol ${requiredRole} pueden realizar esta operación.`
            });

        } catch (error) {
            console.error('Error en validateRole middleware:', error);
            return res.status(500).json({
                message: 'Error al verificar el rol del usuario.',
                error: error.message
            });
        }
    };
};