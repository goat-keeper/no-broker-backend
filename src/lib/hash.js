import bcrypt from "bcryptjs";


const SALT_ROUND = 10;


export async function hashPassword(password){
    return await bcrypt.hash(password,SALT_ROUND)
}

export async function comparePassword(password,hashPassword){
    return await bcrypt.compare(password,hashPassword)
}