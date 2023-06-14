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

export const getFullInfoTeams = async() => {

}

export const getUniqueTeams = async() => {
    let arrayTeams = await readDBFile('/uniqueInfo/clubs')
    //filter only not null teams
    arrayTeams = arrayTeams.filter(team => team !== null)
    //filter unique info with a set
    const setTeams = new Set(arrayTeams)
    return setTeams
}