import bcryptjs from 'bcryptjs';

export function encryptPass(pass) {
    const saltRounds = 10;
    return bcryptjs.hashSync(pass, saltRounds);
}

export function comparePass(pass, hash) {
    return bcryptjs.compareSync(pass, hash)
}