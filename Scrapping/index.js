import * as dotenv from 'dotenv'
import { getFullInfoPlayers, getUniqueInfo } from './players.js'
import { getFullInfoTeams } from './teams.js'

dotenv.config()

const urlBase = process.env.URL_BASE
const urlLeague = process.env.URL_EREDIVISIE

// await getFullInfoTeams(urlBase, urlLeague, 'teams_eredivisie')
// await getFullInfoPlayers(urlBase, 'teams_eredivisie',[])
await getUniqueInfo(['players_teams_league_1','players_teams_eredivisie'])