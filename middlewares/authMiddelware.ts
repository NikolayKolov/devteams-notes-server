import { TokenPayload } from "../config/types";
import { decodeLoginToken } from "../utils/token";
import { Request, Response, NextFunction } from "express";

const authUserRequest = (req: Request, res: Response, next: NextFunction) => {
    let token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            status: 'authError',
            message: 'Unauthorized'
        });
    }

    token = token.split(' ')[1]; // Remove 'Bearer ' string from Authorization header
    try {
        const decoded: TokenPayload = decodeLoginToken(token);
        res.locals.userId = decoded.sub;
        next();
    } catch (e) {
        return res.status(403).send({
            status: 'authError',
            message: 'Invalid login credentials, please logout and login again'
        });
    }
}

export default authUserRequest;