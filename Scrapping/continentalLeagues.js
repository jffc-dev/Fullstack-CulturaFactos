import { readDBFileOrCreate, scrape, writeDBFile } from "./utils.js";

export const scrapLeagues = async(urlLeagues, urlLeagueBase, urlBase) => {
    
    console.log(`1. LEAGUES`)

    const fileName = 'leagues'
    const leaguesArray = await readDBFileOrCreate(fileName,'json',[])

    console.log(`1.1. LEAGUES: ${leaguesArray.length} leagues were found in the file.`)

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
                    console.log(`1.2. LEAGUES: ${leagueUrl} league will be added.`)

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
                console.log(`1.3. LEAGUES: ${cupUrl} cup will be added.`)

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

    await getUniqueCupTypes(fileName);

    await getDetailsLeagues(leaguesArray, urlBase);

    return leaguesArray;
}

export const getUniqueCupTypes = async(leaguesFyle) => {
    console.log(`2. LEAGUE TYPES.`)
    
    const fileName = 'leagueTypes'
    const leaguesArray = await readDBFileOrCreate(leaguesFyle,'json',[])

    const uniqueTypes = leaguesArray.reduce((types, item) => {
        types.add(item.type);
        return types;
    }, new Set());

    const arrayTypes = Array.from(uniqueTypes)

    console.log(`2.1. LEAGUE TYPES: ${arrayTypes.length} types were found.`)
      
    writeDBFile(fileName,arrayTypes)
}

export const getDetailsLeagues = async(leaguesArray, urlBase) => {
    console.log(`3. LEAGUE DETAILS.`)

    const SEASON_SUFIX = '/plus/?saison_id='
    const fileName = 'seasonsByLeague'
    const seasonsByLeagueArray = await readDBFileOrCreate(fileName,'json',[])

    console.log(`3.1. LEAGUE DETAILS: ${seasonsByLeagueArray.length} league details were found in the file.`)

    const getTeamsBySeason = async(unique, fullLink, scrape, urlBase) => {
        console.log(`3.3.1. LEAGUE DETAILS TEAMS.`)

        let $scrape = scrape
        if(!unique){
            $scrape = await scrape(fullLink);
        }

        const teamsPageLink = $scrape('div.data-header__box--small a').attr('href')
        const $teamsPage = await scrape(urlBase+teamsPageLink);

        const teams = []
        const $rows = $teamsPage('table.items > tbody > tr td.hauptlink')

        console.log(`3.3.2. LEAGUE DETAILS TEAMS: ${fullLink} detail league has ${$rows.length} teams.`)

        for (let i = 0; i < $rows.length; i++) {
            const $el = $($rows[i])
            const teamLink = $el.find("a").attr('href')
            const teamName = $el.find("a").text().trim()
            teams.push({
                'link': teamLink,
                'name': teamName
            })
        }

        return teams
    }

    for (let index = 0; index < leaguesArray.length; index++) {
        const dataLeague = leaguesArray[index]
        console.log(`3.2. LEAGUE DETAILS: ${dataLeague.link} league details will be validated.`)

        const $leaguePage = await scrape(urlBase + dataLeague.link);

        const seasons = $leaguePage('ul.chzn-results li');

        console.log(`3.3. LEAGUE DETAILS: ${dataLeague.link} league has ${seasons.length} seasons.`)

        if(seasons.length <= 0){
            const seasonYearLink = urlBase + dataLeague.link
            const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)

            if(!validation){
                const teams = await getTeamsBySeason(true, seasonYearLink, $leaguePage, urlBase);

                console.log(`3.4. LEAGUE DETAILS: ${dataLeague.link} league unique details will be added.`)

                seasonsByLeagueArray.push({
                    'linkLeague': cupdataLeague.linkUrl,
                    'link': cupdataLeague.linkUrl,
                    'season': 'unique',
                    'teams': teams
                })

                writeDBFile(fileName,seasonsByLeagueArray)
            }
        }

        for (let j = 0; j < seasons.length; j++) {
            const $season = $(seasons[j])
            const seasonYear = $season.text().trim()

            const seasonYearLink = urlBase + dataLeague.link + SEASON_SUFIX + (parseInt(seasonYear) - 1).toString()
            const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)

            if(!validation){
                const teams = await getTeamsBySeason(false, seasonYearLink, null, urlBase);

                console.log(`3.4. LEAGUE DETAILS: ${dataLeague.link} league ${parseInt(seasonYear).toString()} details will be added.`)

                seasonsByLeagueArray.push({
                    'linkLeague': cupdataLeague.linkUrl,
                    'link': cupdataLeague.linkUrl,
                    'season': parseInt(seasonYear).toString(),
                    'teams': teams
                })

                writeDBFile(fileName,seasonsByLeagueArray)
            }
        }
    }
}

