import * as jose from 'jose'


const JWT_SECRET = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET)
const JWT_SECRET_ALG = import.meta.env.VITE_JWT_SECRET_ALG
const JWT_EXPIRATION_TIME = import.meta.env.VITE_JWT_EXPIRATION_TIME


export async function signJWT(context) {
    return await new jose.SignJWT({'user': context})
                                   .setProtectedHeader({ alg: JWT_SECRET_ALG })
                                   .setIssuedAt()
                                   .setIssuer('todo-app')
                                   .setExpirationTime(JWT_EXPIRATION_TIME)
                                   .sign(JWT_SECRET)
}

export async function verifyJWT(token) {
    const { payload, protectedHeader } = await jose.jwtVerify(token, JWT_SECRET)
    return { payload, protectedHeader }
}


export async function decodeJWT(token) {
    try {
        const { payload, protectedHeader } = await verifyJWT(token)
        if (payload.user) {
            return payload
        }
    } catch (error) {
        return false
    }
}
