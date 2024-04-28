import { z } from 'zod';
import { labels } from '../../config/labels';

export const CreateUser = z.object({
    email: z.string().email().min(5).max(50, {message: 'Must be below 50 characters'}),
    firstName: z.string().min(1).max(50, {message: 'Must be below 50 characters'}),
    lastName: z.string().min(1).max(50, {message: 'Must be below 50 characters'}),
    password: z.string().min(8, { message: 'Must have at least 8 characters' }),
    passwordRepeat: z.string().min(8, { message: 'Must have at least 8 characters' })
}).refine((data) => data.password === data.passwordRepeat, {
    message: labels.passwordRetypeError,
    path: ["passwordRepeat"], // path of error
}).superRefine(({ password }, ctx) => {
    // password strength regex
    const passwordContainUpperCase = /[A-Z]+/g;
    const passwordContainLowerCase = /[a-z]+/g;
    const passwordContainNumber = /[0-9]+/g;
    const passwordContainSpecial = /[!@#$%^&\\*()\\]+/g;
    // check password strength
    let errorMessage = [];
    const hasLower = passwordContainLowerCase.test(password);
    if (!hasLower) errorMessage.push(labels.passwordLowerCase);

    const hasUpper = passwordContainUpperCase.test(password);
    if (!hasUpper) errorMessage.push(labels.passwordUpperCase);

    const hasNumber = passwordContainNumber.test(password);
    if (!hasNumber) errorMessage.push(labels.passwordNumber);

    const hasSpecial = passwordContainSpecial.test(password);
    if (!hasSpecial) errorMessage.push(labels.passwordSpecial);

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
        ctx.addIssue({
            code: 'custom',
            message: errorMessage.join('\n'),
            path: ['password']
        });
    }
});

export type UserCreateRequestType = z.infer<typeof CreateUser>; 