import { FastifyInstance } from "fastify";
import { signup, getAllUsers, loginUser } from "../../services/users/user-handler";
import { userBody } from "../../types";
import { LoginCredentials } from "../../types";
import { loginSchema, registerSchema } from "../../request_schema/schema";
import { authMiddleware } from "../../middlewares/authMiddleware";

// This is a plugin that will be used to register the routes
async function userRoutes(server: FastifyInstance) {
    // Get all users
    server.get("/", async (request, reply) => {
        try {
            const result = await getAllUsers();
            reply.status(200).send(result);
        } catch (err: any) {
            reply.status(500).send({ success: false, data: err });
        }
    });

    // Register
    server.post<{ Body: userBody }>(
        "/signup",
        { schema: registerSchema },
        async (request, reply) => {
            const { username, email, password } = request.body;
            try {
                const result = await signup({ username, email, password });
                reply.status(201).send(result);
            } catch (err: any) {
                reply.status(500).send({ success: false, data: err.message });
            }
        }
    );

    // Login
    server.post<{ Body: LoginCredentials }>(
        "/login",
        { schema: loginSchema },
        async (request, reply) => {
            const { email, password } = request.body;
            try {
                const user = await loginUser({ email, password });

                //! if sameSite: none, we need to have secure: true
                //! Also make sure domain is same for both, localhost and not 127.0.0.1
                reply.setCookie("refreshToken", user.refreshToken, {
                    path: "/",
                    secure: true,
                    sameSite: "none",
                    maxAge: 30000,
                    domain: "localhost",
                });
                reply.setCookie("accessToken", user.accessToken, {
                    path: "/",
                    secure: true,
                    sameSite: "none",
                    maxAge: 900,
                    domain: "localhost",
                });
                return reply.status(200).send(user);
            } catch (err: any) {
                return reply.status(500).send({ message: err.message });
            }
        }
    );

    // Private route
    server.get("/private", { preHandler: authMiddleware }, async (request, reply) => {
        console.log("You are in the protected route");
        return reply
            .status(200)
            .send({ success: true, message: "You successfully entered private route" });
    });
}
export default userRoutes;
