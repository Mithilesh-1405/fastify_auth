const jwt = require("jsonwebtoken");

const refreshExpiresIn = "5m";
const accessExpiresIn = "1m";

export const createJWT = (id: any, tokenRequestType: string) => {
    const token = jwt.sign(
        { id },
        tokenRequestType === "access"
            ? process.env.SECRET_KEY_ACCESS
            : process.env.SECRET_KEY_REFRESH,
        {
            expiresIn: tokenRequestType === "access" ? accessExpiresIn : refreshExpiresIn,
        }
    );
    return token;
};
