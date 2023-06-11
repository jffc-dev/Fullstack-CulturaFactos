import { createOne, createMultiple, list } from "../mongo.js";

const COLLECTION_NAME = 'player';

export const listPlayers = async() => {
    const players = await list(COLLECTION_NAME);
    return players
}

export const createPlayer = async(player) => {
    const result = await createOne(COLLECTION_NAME, player);
    return result
}

export const createMultiplePlayers = async(players) => {
    const result = await createMultiple(COLLECTION_NAME, players);
    return result
}