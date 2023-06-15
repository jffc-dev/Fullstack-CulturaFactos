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
    let index = 0
    for (const urlTeam of setTeams) {
        if (index > 2) return 
        const scrappedData = await scrapeTeamInfo(urlBase, urlTeam)
        console.log(scrappedData);
        index++
    }
}

const scrapeTeamInfo = async(urlBase, url) => {
    const $ = await scrape(urlBase+url)
    const teamName = $("h1.data-header__headline-wrapper").text().trim()
    const successesLink = '/'+url.split('/')[1]+'/erfolge/'+url.split('/')[3]+'/'+url.split('/')[4]
    const foundationDateStr = $('span[itemprop="foundingDate"]').text().trim()
    const foundationDate = foundationDateStr ? new Date(foundationDateStr.split("/")[2], foundationDateStr.split("/")[1] - 1, foundationDateStr.split("/")[0]) : null;

    return {
        'teamName': teamName,
        'url': url,
        'successesLink': successesLink,
        'foundationDate': foundationDate
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