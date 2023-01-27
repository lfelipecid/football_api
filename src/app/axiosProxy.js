const axios = require('axios')
const HttpsProxyAgent = require('https-proxy-agent')
const cheerio = require('cheerio')

async function crawlerProxy() {
    const res = await axios.get('https://spys.one/en/free-proxy-list/', config)
    if (res.status == 200) {
        const html = res.data
        const $ = cheerio.load(html)

        $('tr.spy1xx', html).each((id, el) => {
            const host = $('font.spy14', el).text().split('document')[0]
            const port = $('font.spy2', el).text()
            console.log(`H:${host} P: ${port}`)

            if (id > 3) return false
        })

    } else {
        console.log(res.status)
    }
}

// crawlerProxy()