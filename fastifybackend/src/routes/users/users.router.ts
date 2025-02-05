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
                reply.setCookie('refreshToken', user.refreshToken , {
                    path: '/',
                    secure: true,
                    httpOnly: true,
                    maxAge: 86400
                  })
                reply.status(201).send(user);
            } catch (err: any) {
                reply.status(500).send({ message: err.message });
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
