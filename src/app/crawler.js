const cheerio = require('cheerio')
const axios = require('axios')

class CrawlerAxios {
    constructor() {
        this.sources = [
            {
                name: 'betfair',
                address: 'https://www.betfair.com/sport/football?couponListType=BY_COMPETITION'
            },
        ]

        this.headers = {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "cookie": "storageSSC = lsSSC % 3D1; PI = 4546; rfr = 4546; _gcl_au = 1.1.1629315064.1671622101; OptanonAlertBoxClosed = 2022 - 12 - 21T11: 28: 24.716Z; _scid = 5edff7d7 - 06f6 - 4378 - b52e - 39255f950d28; _ga_DC69KVTC2E = GS1.1.1671622104.1.1.1671622115.49.0.0; LPVID = JhZmMwMWY3YmY0MmVkYzQ2; exp = sb; bfsd = ts = 1671726805665 | st=rp; AMCV_B65DD3125480E1120A4C98A6 % 40AdobeOrg = MCMID % 7C49965584844985466870791221744307273727; nllastdelid = 24fc52e; userhistory = 1637097221671810193204 | 1 | N | 231222 | 231222 | home | N; bucket = 3~22~control_search; bftim = 1671810193204; bfj = BR; _mibhv = 123456_4795; vid = 33a2ade1 - 86c2 - 11ed - a717 - fa163ea304c2; pi = partner4546; xsrftoken = e2f39391 - 9738 - 11ed - 9da3 - fa163e8e1531; Qualtrics_Cookie = 123456; _gid = GA1.2.1404283887.1674519810; wsid = 91a43f90 - 9d6d - 11ed - baa5 - fa163e6d4ddc; TrackingTags = prod_vertical = ecommerce; StickyTags = prod_vertical = ecommerce; BETEX_ESD = accountservices; _ = 1674752245249; betexPtk = betexLocale % 3Den % 7EbetexRegion % 3DGBR; language = en_GB; betexPtkSess = betexCurrencySessionCookie % 3DBRL % 7EbetexLocaleSessionCookie % 3Den % 7EbetexRegionSessionCookie % 3DGBR; _uetsid = 5522f0809b7d11edbcef53fc964461c2; _uetvid = 952ce510812211ed893287871263efee; TEAL = v: 71853471173028254104418985127556f781a675e38$t: 1674761840192$sn: 22$en: 7$s: 1674757544130 % 3Bexp - sess; _ga = GA1.1.521837309.1671622105; _ga_HB5ZTJ2DE4 = GS1.1.1674757543.26.1.1674760042.58.0.0; _ga_K0W97M6SNZ = GS1.1.1674757543.26.1.1674760042.58.0.0; OptanonConsent = isGpcEnabled = 0 & datestamp=Thu + Jan + 26 + 2023 + 16 % 3A07 % 3A22 + GMT - 0300 + (Hor % C3 % A1rio + Padr % C3 % A3o + de + Bras % C3 % ADlia) & version=6.18.0 & isIABGlobal=false & hosts=& consentId=a57cfc47 - 5b98 - 4a03 - b1e6 - 1d31923fcf86 & interactionCount=1 & landingPath=NotLandingPage & AwaitingReconsent=false & groups=C0001 % 3A1 % 2CC0003 % 3A1 % 2CC0002 % 3A1 % 2CC0004 % 3A1 & geolocation=% 3B",
                "user-agent": 'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 109.0.0.0 Safari / 537.36',
            }
        }

    }

    async CrawlerBetFair() {

        try {
            const session = axios.create(this.headers)
            const res = await session.get(this.sources[0].address)
            if (res.status !== 200) return console.log(`##ERROR: ${res.status}`)
            const html = res.data
            const $ = cheerio.load(html)

            const arrayGames = []

            // LEAGUE CONTAINER
            const allLeagues = $('li.section', html)
            allLeagues.each((index, elLeague) => {

                const league = $('.section-header-title', elLeague).text().replace(/\n/g, '')

                // GAME CONTAINER
                const allGames = $('.event-information', elLeague)
                allGames.each((id, elGame) => {
                    const game = {}
                    const teams = []
                    const odds = []

                    // LEAGUE
                    game.league = league

                    // TEAM
                    $('.team-name', elGame).each((idTeam, elTeam) => {
                        teams.push($(elTeam).text().replace(/\n/g, ''))
                    })
                    game.teams = teams

                    // ODDS
                    $('.details-market.market-3-runners .ui-runner-price', elGame).each((idOdd, elOdd) => {
                        odds.push($(elOdd).text().replace(/\n/g, ''))
                    })
                    game.odds = odds

                    // TIME & SCORE
                    let gameTime = $('.event-inplay-state', elGame).text().trim()
                    if (gameTime) {
                        game.gameTime = `LIVE: ${gameTime}`
                        game.score = $('.inplaynow-score', elGame).text().replace(/\n/g, '').trim().split(' ')
                    } else {
                        game.gameTime = $('.ui-countdown', elGame).text().replace(/\n/g, '')
                    }

                    arrayGames.push(game)
                    
                })
            })
            return arrayGames
        } catch (err) {
            throw err
        }
    }
}

module.exports = new CrawlerAxios()


