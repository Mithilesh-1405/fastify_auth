import "dotenv/config";
import { fastifyFormbody } from "@fastify/formbody";
import userRouter from "./routes/users";
import ShortUniqueId from "short-unique-id";
import { swaggerConfig } from "./swagger";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import connectToDb from "./configs/db";
import fastify from "fastify";
import fastifyCookie from '@fastify/cookie'

const service = fastify({
    logger: {
        name: "fastify-boilerplate",
        level: "trace",
    },
    genReqId: () => new ShortUniqueId({ length: 10 }).randomUUID(),
});

declare module "fastify" {
    interface FastifyInstance {
        connectToDb(): Promise<string>;
    }
}

service.register(require("@fastify/cors"), {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
});

service.register(fastifyFormbody);
service.register(swagger, swaggerConfig);
service.register(swaggerUi, { routePrefix: "/docs" });
service.register(fastifyCookie, {
    secret: "my-secret",
    hook: 'onRequest',
  })

// Endpoint routers
service.decorate("connectToDb", connectToDb);
service.register(userRouter);

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9666;
        const host = process.env.HOST || "localhost";
        service.listen({ port: port, host: host }, async (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            const dbConnection = await service.connectToDb();
            console.log(dbConnection);
        });
    } catch (err) {
        service.log.error(err);
        process.exit(1);
    }
};

start();
