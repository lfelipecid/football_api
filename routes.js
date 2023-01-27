const route = require('express').Router()
const homeController = require('./src/controllers/homeController')
const gamesController = require('./src/controllers/gamesController')
const liveGamesController = require('./src/controllers/liveGamesController')

// ROUTES
route.get('/', homeController.index) // Home
route.get('/games/', gamesController.index) // All games
route.get('/live/', liveGamesController.index) // Live Games

module.exports = route