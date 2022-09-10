const express = require('express')
const router = express.Router()

const artistRoutes = require('./artists/artists')
const genresRoutes = require('./genres/genres')
const musicRoutes = require('./music/music')
const searchRoutes = require('./search/search')

router.use('/artists', artistRoutes)
router.use('/genres', genresRoutes)
router.use('/music', musicRoutes)
router.use('/search', searchRoutes)

module.exports = router