import { createOne } from "../mongo.js";

const COLLECTION_NAME = 'user';

export const createUser = async(player) => {
    const result = await createOne(COLLECTION_NAME, player);
    return result
}