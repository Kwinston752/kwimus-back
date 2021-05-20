const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')

const genresRoutes = express.Router()

genresRoutes.get('/popular', async (req, res) => {
    const page = await unirest.get('https://sefon.pro/')
    const $ = cheerio.load(page.body)
    const result = []

    $('.b_genre').get().map(el => {
        const element = $(el).get()
        result.push({
            link: $(element).attr('href'),
            title: $(element).text().replace('# ', '').trim()
        })
    })

    return res.json(result.slice(0, 7))
})

module.exports = genresRoutes