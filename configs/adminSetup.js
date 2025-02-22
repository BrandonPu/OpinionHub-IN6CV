import User from "../src/users/user.model.js";
import { hash } from "argon2";

export const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("admin123");

            const adminUser = new User({
                name: "Admin",
                surname: "System",
                username: "admin",
                email: "admin@system.com",
                password: hashedPassword,
                role: "ADMIN_ROLE",
            });

            await adminUser.save();
            console.log("Administrador creado correctamente.");
        } else {
            console.log("Administrador ya existente.");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error);
    }
};
