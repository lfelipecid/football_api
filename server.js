const express = require('express')
const routes = require('./routes')
// const homeRoute = require('./src/routes/homeRoutes')
// const gamesRoute = require('./src/routes/gamesRoutes')

class MainApp {
    constructor() {
        this.app = express()
        this.middleware()
        this.routes()
    }

    middleware() {
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
    }

    routes() {
        this.app.use(routes)
    }

    runServer() {
        const PORT = process.env.PORT || 3000
        this.app.listen(PORT, () => {
            console.log(`### => http://localhost:${PORT}`)
        })
    }
}

const app = new MainApp()
app.runServer()

