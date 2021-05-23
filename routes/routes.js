const express = require('express')
const router = express.Router()

const artistRoutes = require('./artists/artists')
const genresRoutes = require('./genres/genres')
const musicsRoutes = require('./musics/musics')

router.use('/artists', artistRoutes)
router.use('/genres', genresRoutes)
router.use('/musics', musicsRoutes)

router.use('/', async (req, res) => {
    return res.send('Hello World!')
})

module.exports = router