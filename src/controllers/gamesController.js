const crawler = require('../app/crawler')

class GamesController {
    async index(req, res) {

        const result = await crawler.CrawlerBetFair()
        return res.json(result)
    }
}

module.exports = new GamesController()