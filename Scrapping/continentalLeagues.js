import { readDBFileOrCreate, scrape, writeDBFile } from "./utils.js";

export const scrapLeagues = async(urlLeagues, urlLeagueBase, urlBase) => {
    const fileName = 'leagues'
    const leaguesArray = await readDBFileOrCreate(fileName,'json',[])

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

                const validation = leaguesArray.find(league => league.link === leagueUrl)

                if(!validation){
                    const $leagueDetail = await scrape(urlBase+leagueUrl);
                    const leagueFullname = $leagueDetail('h1.data-header__headline-wrapper').text().trim();
                    const leagueImage = $leagueDetail('.data-header__profile-container img').attr('src');
                    const leagueCountry = $leagueDetail('.data-header__box--big .data-header__club a').text().trim();
                    leaguesArray.push({
                        'link': leagueUrl,
                        'shortname': leagueName,
                        'fullname': leagueFullname,
                        'image': leagueImage,
                        'country': leagueCountry,
                        'type': 'national'
                    })
                    writeDBFile(fileName,leaguesArray)
                }
            }
        }

        const cups = $('main div.row div:nth-child(2) div.box a')

        for (let i = 0; i < cups.length; i++) {
            const $el = $(cups[i])
            const cupShortname = $el.attr('title')
            const cupUrl = $el.attr('href')

            const validation = leaguesArray.find(league => league.link === cupUrl)

            if(!validation){
                const $urlDetail = await scrape(urlBase+cupUrl);
                const cupFullname = $urlDetail('h1.data-header__headline-wrapper').text().trim();
                const cupImage = $urlDetail('.data-header__profile-container img').attr('src');
                const cupCountry = $urlDetail('.data-header__box--big .data-header__club a').text().trim();
                const cupLabels = $urlDetail('li.data-header__label');
                let cupType = null

                for (let j = 0; j < cupLabels.length; j++) {
                    const $labels = $(cupLabels[j])
                    const text = $labels.text().trim().split('\n');
                    if(text[0] === 'Tipo de copa:'){
                        cupType = text[2].trim()
                    }
                }

                leaguesArray.push({
                    'link': cupUrl,
                    'shortname': cupShortname,
                    'fullname': cupFullname,
                    'image': cupImage,
                    'country': cupCountry,
                    'type': cupType
                })
                writeDBFile(fileName,leaguesArray)
            }
        }
    }

    getUniqueCupTypes(fileName);

    return leaguesArray;
}

export const getUniqueCupTypes = async(leaguesFyle) => {
    const fileName = 'leagueTypes'
    const leaguesArray = await readDBFileOrCreate(leaguesFyle,'json',[])

    const uniqueTypes = leaguesArray.reduce((types, item) => {
        types.add(item.type);
        return types;
    }, new Set());
      
    await readDBFileOrCreate(fileName,'json',uniqueTypes)
}

export const getDetailLeague = async(leaguesArray, urlBase) => {
    const SEASON_SUFIX = '/plus/?saison_id='
    const fileName = 'seasonsByLeague'
    const seasonsByLeagueArray = await readDBFileOrCreate(fileName,'json',[])

    for (let index = 0; index < leaguesArray.length; index++) {
        const dataLeague = leaguesArray[index]
        const $leaguePage = await scrape(urlBase + dataLeague.link);

        const seasons = $leaguePage('ul.chzn-results li');

        if(seasons.length < 0){
            const seasonYearLink = urlBase + dataLeague.link + SEASON_SUFIX + (parseInt(seasonYear) - 1).toString()
            const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)

            if(!validation){

            }
            seasonsByLeagueArray
        }

        for (let j = 0; j < seasons.length; j++) {
            const $season = $(seasons[j])
            const seasonYear = $season.text().trim()

            const seasonYearLink = urlBase + dataLeague.link + SEASON_SUFIX + (parseInt(seasonYear) - 1).toString()
            const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)

            if(!validation){

            }
        }
    }
}

