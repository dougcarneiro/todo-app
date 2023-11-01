import bcrypt from 'bcrypt';

export function encryptPass(pass) {
    const saltRounds = 10;
    return bcrypt.hashSync(pass, saltRounds);
}

export function comparePass(pass, hash) {
    return bcrypt.compareSync(pass, hash)
}