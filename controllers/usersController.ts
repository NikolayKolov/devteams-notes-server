import { Prisma, User } from '@prisma/client';
import prisma from '../prisma/prismaClient';
import { generateLoginToken } from '../utils/token';
import { hashPassword, comparePasswordHash } from '../utils/hash';
import { JSONErrorResponse, LoginUserRequest } from '../config/types';
import { labels } from '../config/labels';
import { CreateUser, UserCreateRequestType } from '../utils/validators/createUser';
import { Request, Response } from "express";

export const registerUser = async (req: Request<{}, {}, UserCreateRequestType>, res: Response) => {
    const {
        email,
        firstName,
        lastName,
        password
    } = req.body;

    const userValidate = CreateUser.safeParse(req.body);

    if (!userValidate.success) {
        const errorsObject: any = {}
        userValidate.error.issues.forEach((error) => {
            const errorKey = error.path[0].toString();
            errorsObject[errorKey] = error.message;
        });
        const errorResp: JSONErrorResponse = {
            status: labels.errorCreateDB,
            message: labels.errorUserCreate,
            errorObject: errorsObject
        };

        res.status(500).send(errorResp);
        return;
    }

    const hash = await hashPassword(password);

    const userData: Prisma.UserCreateInput = {
        email,
        firstName,
        lastName,
        passSaltHash: hash
    };

    try {
        const user: User = await prisma.user.create({ data: userData });
        res.status(200).send(user);
    } catch(e) {
        const errorResp: JSONErrorResponse = {
            status: labels.errorCreateDB,
            message: labels.errorUserCreate,
            messageOrig: (e as Error)?.message,
            stack: (e as Error)?.stack,
            name: (e as Error)?.name
        };

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                errorResp.message = labels.errorUserExists(email)
            }
        }

        res.status(500).send(errorResp);
    }
}

export const loginUser = async (req: Request<{}, {}, LoginUserRequest>, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (user === null) {
        
        const errorResp: JSONErrorResponse = {
            status: labels.errorAuth,
            message: labels.errorMissingUser(email),
            name: 'email'
        };
        res.status(401).send(errorResp);
    }

    const loginSuccessful = await comparePasswordHash(password, user!.passSaltHash);

    if (loginSuccessful) {
        res.status(200);
        const token = generateLoginToken(user!);
        res.json({
            jwt: token,
            userId: user!.id,
            userName: user!.firstName + ' ' + user!.lastName,
            userEmail: user!.email
        });
    } else {
        
        const errorResp: JSONErrorResponse = {
            status: labels.errorAuth,
            message: labels.errorPassword,
            name: 'password'
        }
        res.status(401).send(errorResp);
    }

    res.end();
}