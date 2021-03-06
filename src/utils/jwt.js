import jwt from "jsonwebtoken";

export const sign = (payload) => {
    let token = jwt.sign(payload, process.env.SECRET_KEY, {algorithm: "HS256", expiresIn: "1h"});
    return token;
}