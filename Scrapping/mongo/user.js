import { createOne, get } from "../mongo.js";

const COLLECTION_NAME = 'user';

export const createUser = async(player) => {
    const result = await createOne(COLLECTION_NAME, player);
    return result
}

export const getByUsername = async(username) => {
    const query = {Username: username}
    const players = await get(COLLECTION_NAME, query);
    return players[0]
}