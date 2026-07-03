import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)  // Entre más rondas se le agregue, más dificil con fuerza bruta va a romperse el password
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}