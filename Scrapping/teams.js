import { writeDBFile, scrape, readDBFile } from './utils.js'

const getTeamsByLeague = async(url) => {
    const $ = await scrape(url)
    const $rows = $('.responsive-table table.items > tbody > tr td.hauptlink')
    const teams = []
    $rows.each((_, el) => {
        const $el = $(el)
        const rawValue = $el.find("a").attr('href')
        teams.push(rawValue)
    })
    return teams
}

export const getNameTeams = async(urlBase, urlLeague, fileName) => {
    const teams = await getTeamsByLeague(urlBase+urlLeague)
    await writeDBFile("teamsByLeague/"+fileName, teams)
}

export const getFullInfoTeams = async(urlBase, setTeams) => {
    const teamsArray = [];
    const stadiumsArray = [];
    let index = 0
    for (const urlTeam of setTeams) {
        if (index > 2) break 
        const $ = await scrape(urlBase+urlTeam)
        const scrappedDataTeam = scrapeTeamInfo($, urlTeam)
        const scrappedDataStadium = scrapeStadiumInfo($)
        
        addUniqueToArray(teamsArray, scrappedDataTeam)
        addUniqueToArray(stadiumsArray, scrappedDataStadium)
        index++
    }
}

const addUniqueToArray = (array, element) => {
    const found = array.find((el)=>el.link === element.link)
    if(!found){
        array.push(element)
    }
}

export const scrapeTeamInfo = ($, url) => {
    
    const teamName = $("h1.data-header__headline-wrapper").text().trim()
    const successesLink = '/'+url.split('/')[1]+'/erfolge/'+url.split('/')[3]+'/'+url.split('/')[4]
    const foundationDateStr = $('span[itemprop="foundingDate"]').text().trim()
    const foundationDate = foundationDateStr ? new Date(foundationDateStr.split("/")[2], foundationDateStr.split("/")[1] - 1, foundationDateStr.split("/")[0]) : null;
    const stadiumElement = $('ul.data-header__items li.data-header__label')[4];
    const $stadiumElement = $(stadiumElement);
    const stadiumLink = $stadiumElement.find("a").attr('href');

    return {
        'teamName': teamName,
        'link': url,
        'successesLink': successesLink,
        'foundationDate': foundationDate,
        'stadiumLink': stadiumLink
    }
}

export const scrapeStadiumInfo = ($) => {
    const stadiumElement = $('ul.data-header__items li.data-header__label')[4];
    const $stadiumElement = $(stadiumElement);
    const stadiumLink = $stadiumElement.find("a").attr('href');
    const stadiumName = $stadiumElement.find("a").text().trim();
    const stadiumCapacityText = $stadiumElement.find('.tabellenplatz').text().trim();
    const capacidadStadium = parseInt(stadiumCapacityText.split(' ')[0].replace('.',''));

    return {
        'link': stadiumLink,
        'name': stadiumName,
        'capacity': capacidadStadium
    }
}

export const getUniqueTeams = async() => {
    let arrayTeams = await readDBFile('/uniqueInfo/clubs')
    //filter only not null teams
    arrayTeams = arrayTeams.filter(team => team !== null)
    //filter unique info with a set
    const setTeams = new Set(arrayTeams)
    return setTeams
}

export const writeInfoTeamsFile = async(urlBase) => {
    const setTeams = await getUniqueTeams()
    await getFullInfoTeams(urlBase, setTeams)
}