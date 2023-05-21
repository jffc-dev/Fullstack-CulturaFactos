import { convertToDecimalPriceLoan, readDBFile, scrape, writeDBFile } from './utils.js'

const uniquePositions = new Set();
const uniqueCountries = new Set();
const uniqueClubs = new Set();

const getPlayersByTeam = async (urlBase, teams, specificTeams) => {
    const arrayTeams = await readDBFile(teams)
    const players = []
    const filteredTeams = arrayTeams.filter((team)=>{
        if(specificTeams.length > 0){
            return specificTeams.includes(team) ? true : false
        }else{
            return true
        }
    })

    for (const teamUrl of filteredTeams) {
        const $ = await scrape(urlBase + teamUrl)
        const $rows = $('table.items>tbody>tr table .hauptlink')
        for (let i = 0; i < $rows.length; i++) {
            const $el = $($rows[i]);
            const playerUrl = $el.find("a").attr('href');
            const infoPlayer = await getPlayerInfo(playerUrl, urlBase);
            players.push(infoPlayer);
            console.log('-------------' + teamUrl + ' | ' + infoPlayer.name);
        }
    }
    return players
}

const formatObject = (objetoOriginal, nombres, nationality, url, positions, history) => {
    let playerName = ""
    if(nombres.split('\n')[1]){
        playerName = nombres.split('\n')[1].trim();
    }else{
        playerName = nombres.split('\n')[0].trim();
    }
    
    const nationalities = objetoOriginal['Nacionalidad:'].split('  ')

    const objectNationalities = nationalities.map((eachNationality)=>{
        const main = (nationality === eachNationality) ? true : false;
        uniqueCountries.add(eachNationality)
        return {country: eachNationality, main}
    })

    const partsDate = objetoOriginal['Fecha de nacimiento:'].split("/");
    const height = objetoOriginal['Altura:'] ? parseFloat(objetoOriginal['Altura:'].replace(/[^\d.,]/g, '').replace(',', '.')) * 100 : null

    return {
        'dataBirthdate': new Date(partsDate[2], partsDate[1] - 1, partsDate[0]),
        'height': height,
        'foot': objetoOriginal['Pie:'],
        'fullName': objetoOriginal['Nombre en país de origen:'],
        'name': playerName,
        'url': url,
        'nationalities': objectNationalities,
        'positions':positions,
        'transfers': history
    };
}

const getPlayerInfo = async (url, urlBase) => {
    const $ = await scrape(urlBase + url)
    const $rowsTag = $('.info-table>span.info-table__content--regular')
    const $rowsValue = $('.info-table>span.info-table__content--bold')
    const data = []
    $rowsTag.each((index, el) => {
        const $el = $(el)
        const rawTag = $el.text().trim()
        const rawValue = $($rowsValue[index]).text().trim()
        data.push([rawTag,rawValue])
    })
    const history = await getTransferHistory($, urlBase)
    const positions = getPositionsPlayer($)
    const name = $('h1').text().trim()
    const nationality = $('.data-header__items .data-header__label span[itemprop="nationality"]').text().trim()
    let objectData = formatObject(Object.fromEntries(data), name, nationality, url, positions, history)
    return objectData
}

const getTransferHistory = async($, urlBase) => {
    const $history = $('div.box[data-viewport="Transferhistorie"] .grid:not(.tm-player-transfer-history-grid--heading)')
    const history = []
    let index = 0
    for (const record of $history) {
        const $el = $(record)
        const date = $el.find('.tm-player-transfer-history-grid__date').text().trim()
        const clubTag = $el.find('.tm-player-transfer-history-grid__new-club')
        const clubName = clubTag.text().trim()
        const clubUrlTransfer = clubTag.find('a').attr('href')
        const clubUrl = await getUrlTeam(urlBase + clubUrlTransfer)
        uniqueClubs.add(clubUrl)
        const {price, loan} = convertToDecimalPriceLoan($el.find('.tm-player-transfer-history-grid__fee').text().trim())

        history.push({date, club: {name: clubName, url: clubUrl}, price, loan})

        if(index === $history.length - 1){
            const first_clubTag = $el.find('.tm-player-transfer-history-grid__old-club')
            const first_clubName = first_clubTag.text().trim()
            const first_clubUrlTransfer = first_clubTag.find('a').attr('href')
            if(first_clubName !== 'Desconocido'){
                const first_clubUrl = await getUrlTeam(urlBase + first_clubUrlTransfer)
                uniqueClubs.add(first_clubUrl)
                history.push({date: null, club: {name: first_clubName, url: first_clubUrl}, price: 0, loan: false})
            }
        }
        index++
    }
    return history
}

const getUrlTeam = async(urlTeamTransfer) => {
    const $ = await scrape(urlTeamTransfer)
    const urlTeam = $('#vista-general').find('a').attr('href')
    return urlTeam
}

const getPositionsPlayer = ($) => {
    const positions = []

    if($('.detail-position__box .detail-position__inner-box .detail-position__position').length === 0){
        const mainPosition = $('.detail-position .detail-position__box .detail-position__position').text().trim()
        positions.push({position: mainPosition, main: true})
    }else{
        const mainPosition = $('.detail-position__box .detail-position__inner-box .detail-position__position').text().trim()
        const $positions = $('.detail-position__box .detail-position__position .detail-position__position')

        positions.push({position: mainPosition, main: true})
        uniquePositions.add(mainPosition)
        $positions.each((_, positionEach) => {
            const $el = $(positionEach)
            const position = $el.text().trim()
            positions.push({position, main: false})
            uniquePositions.add(position)
        })
    }
    return positions
}

export const getFullInfoPlayers = async(urlBase, teamsFile, specificTeams) => {
    const players = await getPlayersByTeam(urlBase, teamsFile, specificTeams)
    const combinedUniquePositions = await getLastUniqueInfo('positions',uniquePositions)
    const combinedUniqueCountries = await getLastUniqueInfo('countries',uniqueCountries)
    const combinedUniqueClubs = await getLastUniqueInfo('clubs',uniqueClubs)
    await writeDBFile('players_'+teamsFile, players)
    await writeDBFile('clubs', Array.from(combinedUniqueClubs))
    await writeDBFile('countries', Array.from(combinedUniqueCountries))
    await writeDBFile('positions', Array.from(combinedUniquePositions))
}

const getLastUniqueInfo = async(file, lastSet) => {
    const oldContent = await readDBFile(file)    
    const combinedSet = new Set([...oldContent, ...lastSet])
    return combinedSet
}

export const getUniqueInfo = async(files) => {

    const uniquePositionsSet = new Set();
    const uniqueCountriesSet = new Set();
    const uniqueClubsSet = new Set();
    const uniquePlayersSet = new Set();

    for (const file of files) {
        const arrayPlayers = await readDBFile(file)
        for (const player of arrayPlayers) {
            uniquePlayersSet.add(player.url)
            
            for (const nationality of player.nationalities) {
                uniqueCountriesSet.add(nationality.country)
            }
            for (const position of player.positions) {
                uniquePositionsSet.add(position.position)
            }
            for (const transfer of player.transfers) {
                uniqueClubsSet.add(transfer.club.url)
            }
        }
    }

    const combinedUniquePositions = await getLastUniqueInfo('positions',uniquePositionsSet)
    const combinedUniqueCountries = await getLastUniqueInfo('countries',uniqueCountriesSet)
    const combinedUniqueClubs = await getLastUniqueInfo('clubs',uniqueClubsSet)
    const combinedUniquePlayers = await getLastUniqueInfo('players',uniquePlayersSet)

    await writeDBFile('clubs', Array.from(combinedUniqueClubs))
    await writeDBFile('countries', Array.from(combinedUniqueCountries))
    await writeDBFile('positions', Array.from(combinedUniquePositions))
    await writeDBFile('players', Array.from(combinedUniquePlayers))
}