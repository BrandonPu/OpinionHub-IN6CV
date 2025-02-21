import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query, "name username _id") // Solo mostrar name, username y uid (_id)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener usuarios",
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, oldPassword, newPassword, ...data } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        // Si se envían oldPassword y newPassword, se actualiza la contraseña
        if (oldPassword && newPassword) {
            const isMatch = await verify(user.password, oldPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: "La contraseña actual es incorrecta"
                });
            }
            data.password = await hash(newPassword);
        }

        // Actualiza el usuario con los nuevos datos
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado con éxito",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: error.message
        });
    }
};
