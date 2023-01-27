const crawler = require('../app/crawler')

class liveGamesController {
    async index(req, res) {
        
        const result = await crawler.CrawlerBetFair()

        return res.json(result.filter(s => s.score))

    }
}

module.exports = new liveGamesController()