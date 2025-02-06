import { createJWT } from "../configs/createjwt";

const jwt = require("jsonwebtoken");

export async function authMiddleware(request: any, reply: any) {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        reply.status(404).send({ success: true, message: "No token found" });
    }
    try {
        const verifyAccessToken = () => {
            return new Promise((resolve, reject) => {
                jwt.verify(
                    token,
                    process.env.SECRET_KEY_ACCESS,
                    (err: any, decodedAccessToken: any) => {
                        if (err) reject(err);
                        else resolve(decodedAccessToken);
                    }
                );
            });
        };
        try {
            // verify accesstoken
            const decodedAccessToken = (await verifyAccessToken()) as { _id: string };
            request.user = decodedAccessToken._id;
        } catch (accessTokenError) {
            const refreshToken = request.cookies.refreshToken;
            if (!refreshToken) {
                return reply.status(404).send({ success: true, message: "No refresh token found" });
            }
            const verifyRefreshToken = () => {
                return new Promise((resolve, reject) => {
                    jwt.verify(
                        refreshToken,
                        process.env.SECRET_KEY_REFRESH,
                        (err: any, decodedRefreshToken: any) => {
                            if (err) reject(err);
                            else resolve(decodedRefreshToken);
                        }
                    );
                });
            };
            try {
                // AccessToken not valid, generate new access token
                const decodedRefreshToken = (await verifyRefreshToken()) as { _id: string };
                const newAccessToken = createJWT(decodedRefreshToken._id, "access");
                reply.header("Authorization", `Bearer ${newAccessToken}`);
                request.user = newAccessToken._id;
            } catch (err) {
                return reply.status(401).send({
                    success: false,
                    data: "Session ended, Please login again",
                });
            }
        }
    } catch (err) {
        return reply.status(500).send({ success: false, data: "Error logging in" });
    }
    // try {
    //     jwt.verify(token, process.env.SECRET_KEY_ACCESS, (err: any, decodedAccessToken: any) => {
    //         if (err) {
    //             //if error, token is invalid, using refresh token generate a new one
    //             const refreshToken = request.cookies.refreshToken;
    //             jwt.verify(
    //                 refreshToken,
    //                 process.env.SECRET_KEY_REFRESH,
    //                 (err: any, decodedRefreshToken: any) => {
    //                     if (err) {
    //                         reply.clearCookie("refreshToken", {
    //                             path: "/",
    //                         });
    //                         reply.status(401).send({
    //                             success: false,
    //                             data: "Session ended, Please login again",
    //                         });
    //                     }
    //                     const newAccessToken = createJWT(refreshToken._id, "access");
    //                     reply.header("Authorization", `Bearer ${newAccessToken}`);
    //                 }
    //             );
    //         }
    //         request.user = decodedAccessToken._id;
    //     });
    // } catch (err: any) {
    //     reply.status(404).send({ success: false, data: "Error Logging in" });
    // }
}
