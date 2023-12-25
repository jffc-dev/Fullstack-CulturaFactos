import * as dotenv from 'dotenv'
import { getFullInfoPlayers, getPlayersInfoPiece, getUniqueInfo } from './players.js'
import { getNameTeams, getUniqueTeams, writeInfoTeamsFile } from './teams.js'
import { createMultiplePlayers } from './mongo/player.js'
import { readDBFile } from './utils.js'
import { cleanSeasonsByLeague, cleanTeamsLinksInSeasonsByLeague, scrapLeagues } from './continentalLeagues.js'
import { STEP_1_CLEANINVALIDTEAMS, STEP_2_CLEANSEASONTEAMS } from './utils/consts.js'
import { migrateCoutries } from './migrate/types.js'
import { getUserByUsername } from './migrate/user.js'

dotenv.config()

const urlBase = process.env.URL_BASE
const urlLeague = process.env.URL_EREDIVISIE

const urlLeagues = JSON.parse(process.env.URL_CONTINENTAL_LEAGUES.replace(/'/g, '"'))
const urlLeagueBase = process.env.URL_CONTINENTAL_LEAGUE_BASE

await migrateCoutries()
// const array = await readDBFile('seasonsByLeague')
// console.log(array.length);
// await cleanTeamsLinksInSeasonsByLeague(true,STEP_2_CLEANSEASONTEAMS,false)
// await scrapLeagues(urlLeagues, urlLeagueBase, urlBase);
// await migrateCoutries();

// await cleanSeasonsByLeague()

// await getNameTeams(urlBase, urlLeague, 'teams_eredivisie')
// await getFullInfoPlayers(urlBase, 'teams_eredivisie',[])
// await getUniqueInfo(['players_teams_league_1','players_teams_eredivisie'])

// const migratePlayersToDb = async() => {
//     const arrayPlayers = await readDBFile('/playersByTeam/players_teams_bundesliga')
//     console.log(arrayPlayers);
//     const response = await createMultiplePlayers(arrayPlayers)
//     console.log(response);
// }

// migratePlayersToDb()

// await writeInfoTeamsFile(urlBase)
// await getPlayersInfoPiece(1,"asdfasdf")