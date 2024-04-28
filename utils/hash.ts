const bcrypt = require('bcryptjs');

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(4);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

export const comparePasswordHash = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}