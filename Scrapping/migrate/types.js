import { ONDTipo } from "../models/ONDTipo.js"
import { closeConnection, createType } from "../mongo/type.js"
import { readDBFile } from "../utils.js"
import { getUserByUsername } from "./user.js"

const getCoutries = async () => {
    const file = 'uniqueInfo/countries'
    const arrayCountries = await readDBFile(file)
    const userDefault = await getUserByUsername("jflores")
    const formatCoutries = arrayCountries.map((el, index)=>{
        const tipo = new ONDTipo({
            TableCode: "COU", 
            TypeCode: index + 1,
            Description1: el,
            CreationUser: userDefault.Id, 
            CreationDate: new Date(),
            ModificationUser: null, 
            ModificationDate: null 
        });
        return tipo
    })
    return formatCoutries
}

export const migrateCoutries = async () => {
    const formatCoutries = await getCoutries()
    for (const country of formatCoutries) {
        await createType(country.toModel())
    }
    await closeConnection()
    console.log("aasd");
}