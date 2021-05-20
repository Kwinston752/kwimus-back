const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')

// Utils
const decodeUrl = require('./../../utils/decodeUrl')

const musicsRoutes = express.Router()

musicsRoutes.get('/popular', async (req, res) => {
    const page = await unirest.get('https://sefon.pro/')
    const $ = cheerio.load(page.body)
    const response = []

    $('.b_list_mp3s .mp3').get().map(el => {
        const element = $(el).get()
        response.push({
            artists: {
                title: $(element).find('.artist_name').text(),
                members: $(element).find('.artist_name')
            },
            songInfo: {
                title: $(element).find('.song_name a').text(),
                link: $(element).find('.song_name a').attr('href'),
                duration: $(element).find('.duration .value').text()
            },
            id: $(element).find('.btns span').attr('data-key'),
            songLink: decodeUrl($(element).find('.btns span').attr('data-url'), $(element).find('.btns span').attr('data-key'))
        })
    })

    for (let i in response) {
        const arr = []
        $(response[i].artists.members).find('a').map((i, el) => {
            arr.push({
                name: $(el.children).text(),
                link: el.attribs.href
            })
        })
        response[i].artists.members = arr
    }

    return res.json(response)
})

module.exports = musicsRoutes