const express = require('express')
const router = express.Router()

const artistRoutes = require('./artists/artists')
const genresRoutes = require('./genres/genres')

router.use('/artists', artistRoutes)
router.use('/genres', genresRoutes)

module.exports = router