import { scrape } from "./utils.js";

export const scrapLeagues = async(urlLeagues, urlLeagueBase) => {
    const leaguesArray = [];
    for (const leagueUrl of urlLeagues) {
        const urlLeague = urlLeagueBase.replace('#LEAGUE#', leagueUrl)

        const $ = await scrape(urlLeague + "1")
        const pages = $('.tm-pagination__list-item').length || 1 
        for (let index = 1; index <= pages; index++) {
            const $leaguePage = await scrape(urlLeague + index);
            const leaguesPerPage = $leaguePage('table.items table td:nth-child(2) a')

            for (let j = 0; j < leaguesPerPage.length; j++) {
                const $el = $(leaguesPerPage[j])
                const leagueName = $el.text().trim()
                const leagueUrl = $el.attr('href')
                leaguesArray.push({
                    'link': leagueUrl,
                    'name': leagueName
                }) 
            }
        }
    }
    return leaguesArray;
}