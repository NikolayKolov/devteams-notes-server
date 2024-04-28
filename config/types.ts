export type TokenPayload = {
    sub: number,
    name: string
}

export type JSONErrorResponse = {
    status: string,
    message: string,
    name?: string,
    messageOrig?: string,
    stack?: string,
    errorObject?: object
}

export type LoginUserRequest = {
    email: string,
    password: string
}