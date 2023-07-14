export const NATIONAL_LEAGUE = 'national'

const EXCLUDED_LEAGUE_SEASONS = [
    '/tri-nation-series/startseite/pokalwettbewerb/HTN?saison_id=2022',
    '/three-nations-cup/startseite/pokalwettbewerb/TNCA',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1995',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1994',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1993',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1992',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1991',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1990',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1989',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1988',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1987',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1986',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1985',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1984',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1983',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1982',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1981',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1980',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1979',
    '/caf-champions-league/startseite/pokalwettbewerb/ACL?saison_id=1978',
    '/division-profesional/startseite/wettbewerb/BO1A?saison_id=2021'
]

export const TOVALIDATE_LEAGUE_SEASONS = [
    '/three-nations-cup/teilnehmer/pokalwettbewerb/TNCA/saison_id/2020'
]

//VALIDATION STEPS IN cleanTeamsLinksInSeasonsByLeague
export const STEP_1_CLEANINVALIDTEAMS = 1;
export const STEP_2_CLEANSEASONTEAMS = 2;
