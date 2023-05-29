import { writeDBFile, scrape } from './utils.js'

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

export const getFullInfoTeams = async(urlBase, urlLeague, fileName) => {
    const teams = await getTeamsByLeague(urlBase+urlLeague)
    await writeDBFile("teamsByLeague/"+fileName, teams)
}