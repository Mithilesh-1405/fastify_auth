// Define a schema for all the requests
export const loginSchema = {
    body: {
        properties: {
            email: { type: "string" },
            password: { type: "string" },
        },
        required: ["email", "password"],
    },
    response: {
        200: {
            success: { type: "boolean" },
            data: { type: "object" },
        },
    },
};
export const registerSchema = {
    body: {
        properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
        },
        required: ["username", "email", "password"],
    },
    response: {
        200: {
            success: { type: "boolean" },
            data: { type: "object" },
        },
    },
};
