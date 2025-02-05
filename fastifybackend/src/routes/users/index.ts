import { FastifyInstance } from "fastify";
import userRoutes from "./users.router";

export default async function (server: FastifyInstance) {
    // Here we register the plugin that we created in the user.router.ts file
    server.register(userRoutes, { prefix: "/users" });
}
