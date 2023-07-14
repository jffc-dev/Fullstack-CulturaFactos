import { createHash } from "crypto"
import { createUser } from "../mongo/user.js";
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
    const rpta = await createUser(tipo)
    console.log(rpta);
}