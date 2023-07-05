import { scrapeStadiumInfo, scrapeTeamInfo } from "./teams.js";
import { readDBFileOrCreate, scrape, writeDBFile } from "./utils.js";
import { NATIONAL_LEAGUE, STEP_1_CLEANINVALIDTEAMS, STEP_2_CLEANSEASONTEAMS } from "./utils/consts.js";

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
                        'type': NATIONAL_LEAGUE
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

    await getDetailsLeagues(leaguesArray, urlBase, true);

    const cleanedSeasonsByLeagueArray = await cleanTeamsLinksInSeasonsByLeague(false,STEP_2_CLEANSEASONTEAMS,false)

    const listOfTeams = getUniqueTeams(cleanedSeasonsByLeagueArray)

    const teams = await getTeamDetails(urlBase, listOfTeams)

    return teams;
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

export const getDetailsLeagues = async(leaguesArray, urlBase, validateLeagues) => {
    console.log(`3. LEAGUE DETAILS.`)

    const SEASON_SUFIX = '?saison_id='
    const fileName = 'seasonsByLeague'
    const seasonsByLeagueArray = await readDBFileOrCreate(fileName,'json',[])

    console.log(`3.1. LEAGUE DETAILS: ${seasonsByLeagueArray.length} league details were found in the file.`)

    const getTeamsBySeason = async(unique, fullLink, scrapedPage, urlBase, type) => {
        console.log(`3.3.1. LEAGUE DETAILS TEAMS FIRST.`)
        const replaceableString = 'startseite'
        const newString = 'teilnehmer'

        const teamsPageLink = fullLink.replace(replaceableString, newString)

        //get teams by season link
        // const teamsPageLink = $scrape('ul#submenu li#resumen a').attr('href')

        console.log(`3.3.2. LEAGUE DETAILS TEAMS FIRST: Full link: ${urlBase+teamsPageLink}.`)

        const $teamsPage = await scrape(urlBase+teamsPageLink);

        const teams = []
        const $rows = $teamsPage('table.items > tbody > tr td.hauptlink')

        console.log(`3.3.3. LEAGUE DETAILS TEAMS FIRST: Full link: ${fullLink}, ${urlBase+teamsPageLink} detail teams league has ${$rows.length} teams.`)

        for (let i = 0; i < $rows.length; i++) {
            const $el = $teamsPage($rows[i])
            const teamLink = $el.find("a").attr('href')
            const teamName = $el.find("a").text().trim()
            teams.push({
                'link': teamLink,
                'name': teamName
            })
        }

        if(teams.length === 0 && type === NATIONAL_LEAGUE){

            const $scrape = await scrape(urlBase+fullLink);
            const table = $scrape('table.items')[0]
            const $rows = $scrape(table).find('tbody > tr td.hauptlink')
            console.log(`3.3.4. LEAGUE DETAILS TEAMS FIRST: National Full link: ${fullLink}, ${urlBase+teamsPageLink} detail teams league has ${$rows.length} teams.`)

            for (let i = 0; i < $rows.length; i++) {
                const $el = $teamsPage($rows[i])
                const teamLink = $el.find("a").attr('href')
                const teamName = $el.find("a").text().trim()
                teams.push({
                    'link': teamLink,
                    'name': teamName
                })
            }
        }

        return teams
    }

    const getTeamsBySeasonSecondAttempt = async(fullLink, urlBase) => {
        console.log(`3.3.5. LEAGUE DETAILS TEAMS SECOND.`)
        let replaceableString = 'wettbewerb'
        let newString = 'pokalwettbewerb'

        let teamsPageLink = fullLink.replace(replaceableString, newString)

        replaceableString = 'startseite'
        newString = 'teilnehmer'

        teamsPageLink = teamsPageLink.replace(replaceableString, newString)

        //get teams by season link
        // const teamsPageLink = $scrape('ul#submenu li#resumen a').attr('href')

        console.log(`3.3.5.1. LEAGUE DETAILS TEAMS SECOND: Full link: ${urlBase+teamsPageLink}.`)

        const $teamsPage = await scrape(urlBase+teamsPageLink);

        const teams = []
        const $rows = $teamsPage('table.items > tbody > tr td.hauptlink')

        console.log(`3.3.5.2. LEAGUE DETAILS TEAMS SECOND: Full link: ${fullLink}, ${urlBase+teamsPageLink} detail teams league has ${$rows.length} teams.`)

        for (let i = 0; i < $rows.length; i++) {
            const $el = $teamsPage($rows[i])
            const teamLink = $el.find("a").attr('href')
            const teamName = $el.find("a").text().trim()
            teams.push({
                'link': teamLink,
                'name': teamName
            })
        }

        return teams
    }

    if(validateLeagues){
        for (let index = 0; index < leaguesArray.length; index++) {
            const dataLeague = leaguesArray[index]
            console.log(`3.2. LEAGUE DETAILS: ${dataLeague.link} league details will be validated.`)
    
            const $leaguePage = await scrape(urlBase + dataLeague.link);
    
            const seasonsScrap = $leaguePage('select[name="saison_id"] option');
            const seasons = seasonsScrap.map((_, element) => $leaguePage(element).attr('value')).get();
    
            console.log(`3.3. LEAGUE DETAILS: ${dataLeague.link} league has ${seasons.length} seasons.`)
    
            if(seasons.length <= 0){
                const seasonYearLink = dataLeague.link
                const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)
    
                if(!validation){
                    let teams = await getTeamsBySeason(true, seasonYearLink, $leaguePage, urlBase, dataLeague.type);

                    if(validateTeamsArray(teams)){
                        console.log(`3.4. LEAGUE DETAILS: ${dataLeague.link} league unique details will be added.`)
    
                        seasonsByLeagueArray.push({
                            'linkLeague': dataLeague.link,
                            'link': seasonYearLink,
                            'season': 'unique',
                            'teams': teams
                        })
        
                        writeDBFile(fileName,seasonsByLeagueArray)
                    }else{
                        console.log(`3.4.2. LEAGUE DETAILS: Full link: ${dataLeague.link} has error in teams (${seasonYearLink}).`)
                        teams = await getTeamsBySeasonSecondAttempt(seasonYearLink, urlBase)

                        if(validateTeamsArray(teams)){
                            console.log(`3.4.3. LEAGUE DETAILS: ${dataLeague.link} league unique details will be added in second attempt.`)
        
                            seasonsByLeagueArray.push({
                                'linkLeague': dataLeague.link,
                                'link': seasonYearLink,
                                'season': 'unique',
                                'teams': teams
                            })
            
                            writeDBFile(fileName,seasonsByLeagueArray)
                        }

                        throw new Error(`3.4.4. LEAGUE DETAILS: Full link: ${dataLeague.link} has error in teams (${seasonYearLink}).`);
                    }    
                    
                }
            }
    
            for (let j = 0; j < seasons.length; j++) {
                const seasonYear = seasons[j]
    
                const seasonYearLink = dataLeague.link + SEASON_SUFIX + seasonYear
                const validation = seasonsByLeagueArray.find(season => season.link === seasonYearLink)
    
                if(!validation){
                    let teams = await getTeamsBySeason(false, seasonYearLink, null, urlBase, dataLeague.type);

                    if(validateTeamsArray(teams)){
                        console.log(`3.4. LEAGUE DETAILS: ${dataLeague.link} league ${parseInt(seasonYear).toString()} details will be added.`)
    
                        seasonsByLeagueArray.push({
                            'linkLeague': dataLeague.link,
                            'link': seasonYearLink,
                            'season': parseInt(seasonYear).toString(),
                            'teams': teams
                        })
        
                        writeDBFile(fileName,seasonsByLeagueArray)
                    }else{
                        console.log(`3.4.2. LEAGUE DETAILS: Full link: ${dataLeague.link} has error in teams (${seasonYearLink}).`)
                        teams = await getTeamsBySeasonSecondAttempt(seasonYearLink, urlBase)

                        if(validateTeamsArray(teams)){
                            console.log(`3.4.3. LEAGUE DETAILS: ${dataLeague.link} league details will be added in second attempt.`)
        
                            seasonsByLeagueArray.push({
                                'linkLeague': dataLeague.link,
                                'link': seasonYearLink,
                                'season': 'unique',
                                'teams': teams
                            })
            
                            writeDBFile(fileName,seasonsByLeagueArray)
                        }else{
                            throw new Error(`3.4.4. LEAGUE DETAILS: Full link: ${dataLeague.link} has error in teams (${seasonYearLink}).`);
                        }
                    }
                }
            }
        }
    }

    return seasonsByLeagueArray

}

export const cleanSeasonsByLeague = async() => {
    const fileName = 'seasonsByLeague'
    const seasonsByLeagueArray = await readDBFileOrCreate(fileName,'json',[])
    const filter = seasonsByLeagueArray.filter(season => season.teams.length !== 0)
    writeDBFile(fileName,filter)
}

export const getUniqueTeams = (leaguesSeasonsArray) => {
    console.log(`4. UNIQUE TEAMS.`)
    
    const uniqueTeamLinks = leaguesSeasonsArray.reduce((set, item) => {
        item.teams.forEach((team) => set.add(team.link));
        return set;
    }, new Set());

    const teamsArray = [...uniqueTeamLinks]

    console.log(`4.1. UNIQUE TEAMS. ${teamsArray.length} teams were found.`)

    return teamsArray
}

export const getTeamDetails = async(urlBase, listOfTeams) => {
    console.log(`5. DETAIL TEAMS.`)
    const fileName = 'teams'

    const teamsArray = await readDBFileOrCreate(fileName,'json',[])
    console.log(`5.1. DETAIL TEAMS. ${teamsArray.length} teams were found in the file.`)

    for (const urlTeam of listOfTeams) {
        console.log(`5.2. DETAIL TEAMS. ${urlTeam} details will be validated.`)

        const validationTeam = teamsArray.find(team => team.link === urlTeam)
        
        if(!validationTeam){
            console.log(`5.3. DETAIL TEAMS. ${urlTeam} details will be added.`)
            const $ = await scrape(urlBase+urlTeam)
            const scrappedDataTeam = scrapeTeamInfo($, urlTeam)
            teamsArray.push(scrappedDataTeam)
            writeDBFile(fileName,teamsArray)
        }
    }
}

export const cleanTeamsLinksInSeasonsByLeague = async(ovwOriginalFile, step, exactlyStep) => {
    const SUFIX_FILE = "_cleaned"
    const fileName = 'seasonsByLeague'
    let fileNameWrite = fileName
    if(!ovwOriginalFile){
        fileNameWrite = fileNameWrite+SUFIX_FILE
    }
    console.log(`3.5. CLEAN SEASONS BY LEAGUE.`)

    const seasonsByLeagueArray = await readDBFileOrCreate(fileName,'json',[])

    let filteredSeasons = seasonsByLeagueArray

    if((exactlyStep === true && step === STEP_1_CLEANINVALIDTEAMS) || (exactlyStep === false && step >= STEP_1_CLEANINVALIDTEAMS)){
        filteredSeasons = seasonsByLeagueArray.filter(league =>
            !league.teams.some(team => team.link?.includes("/spieler/") || team.name === "")
        );
    
        const deletedLeagues = seasonsByLeagueArray.length - filteredSeasons.length;
        console.log(`3.5.1. CLEAN SEASONS BY LEAGUE. ${deletedLeagues} were deleted.`)
    }

    if((exactlyStep === true && step === STEP_2_CLEANSEASONTEAMS) || (exactlyStep === false && step >= STEP_2_CLEANSEASONTEAMS)){
        const initialTeams = getUniqueTeams(filteredSeasons)
        filteredSeasons = filteredSeasons.map(item => {
            const modifiedTeams = item.teams.map(team => {
                const linkArray = team.link.split('/')
                const link = linkArray.slice(0, linkArray < 5 ? linkArray.length : 5).join('/');
                return { ...team, link };
            });
            return { ...item, teams: modifiedTeams };
        });
    
        const afterValidationTeams = getUniqueTeams(filteredSeasons)
    
        console.log(`3.5.2. CLEAN SEASONS BY LEAGUE. ${initialTeams.length} initial unique teams. ${afterValidationTeams.length} after validation unique teams.`)    
    }

    writeDBFile(fileNameWrite, filteredSeasons)

    return filteredSeasons
}

const validateTeamsArray = (teamsArray) => {
    console.log(`3.4.1. VALIDATE TEAMS ARRAY.`)

    const filteredArray = teamsArray.filter(team => team.link?.includes("/spieler/") || team.name === "")
    console.log(teamsArray);
    console.log(filteredArray.length);

    return filteredArray.length === 0
}
