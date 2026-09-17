import crypto from 'crypto'

export function generateRandomString(len: number){
    return crypto.randomBytes(len).toString('hex');

}