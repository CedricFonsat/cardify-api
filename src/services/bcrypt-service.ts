import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "../../config";

const saltRounds = SALT_ROUNDS;

const cryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const comparePassword = async (password: string, hash: string) => {
    const compare = bcrypt.compare(password, hash);
    return compare;
};

export { cryptPassword, comparePassword };