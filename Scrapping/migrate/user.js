import { createHash } from "crypto"
import { createUser, getByUsername } from "../mongo/user.js";
import { ONDUser } from "../models/ONDUser.js";

const hashString = (string) => {
    const data = createHash('md5').update(string).digest('base64');
    return data;
}

export const createDefaultUser = async () => {
    const tipo = new ONDUser({
        Username: "jflores", 
        Passsword: hashString("test"),
        Fullname: "Javier Flores",
        CreationUser: null, 
        CreationDate: new Date(),
        ModificationUser: null, 
        ModificationDate: null 
    });
    const rpta = await createUser(tipo.toModel())
    console.log(rpta);
}

export const getUserByUsername = async (username) => {
    const rpta = await getByUsername(username)
    const userOnd = new ONDUser({})
    userOnd.modelToOND(rpta)
    return userOnd
}