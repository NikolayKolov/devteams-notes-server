const jwt = require('jsonwebtoken');
import { User } from '@prisma/client';
import { TokenPayload } from '../config/types';

export const generateLoginToken = (user: User): string => {
    const payload: TokenPayload = {
        sub: user.id,
        name: user.firstName + ' ' + user.lastName
    };

    const token = jwt.sign(payload, process.env.TOKEN_KEY, {
        // expires in one week
        expiresIn: "7d",
    });

    return token;
}

export const decodeLoginToken = (token: string): TokenPayload => {
    return jwt.verify(token, process.env.TOKEN_KEY) as TokenPayload;
}