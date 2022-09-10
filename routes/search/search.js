const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')
const decodeUrl = require('../../utils/decodeUrl')

const searchRoutes = express.Router()

searchRoutes.post('/', async (req, res) => {
    const text = req.body.text

    if (text === undefined) {
        res.statusCode = 204
        return res.send("")
    }

    const url = encodeURI(`https://sefon.pro/search/?q=${text}`)
    const page = await unirest.get(url)
    const $ = cheerio.load(page.body)

    const artists = []
    const music = []

    // Fetch artists
    $('.b_list_artists .ul .li').get().map(el => {
        const element = $(el).get()
        artists.push({
            link: $(element).find('a').attr('href'),
            avatar: $(element).find('img').attr('src'),
            name: $(element).find('.name').text()
        })
    })

    // Fetch musics
    $('.b_list_mp3s .mp3').get().map(el => {
        const element = $(el).get()
        music.push({
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

    for (let i in music) {
        const arr = []
        $(music[i].artists.members).find('a').map((i, el) => {
            arr.push({
                name: $(el.children).text(),
                link: el.attribs.href
            })
        })
        music[i].artists.members = arr
    }

    return res.json({
        artists: artists,
        music: music
    })
})

searchRoutes.post('/short', async (req, res) => {
    const text = req.body.text

    if (text === undefined) {
        res.statusCode = 204
        return res.send("")
    }

    const url = encodeURI(`https://sefon.pro/search/?q=${text}`)
    const page = await unirest.get(url)
    const $ = cheerio.load(page.body)

    const artists = []
    const music = []

    // Fetch artists
    $('.b_list_artists .ul .li').get().splice(0, 3).map(el => {
        const element = $(el).get()
        artists.push({
            link: $(element).find('a').attr('href'),
            avatar: $(element).find('img').attr('src'),
            name: $(element).find('.name').text()
        })
    })

    // Fetch musics
    $('.b_list_mp3s .mp3').get().splice(0, 3).map(el => {
        const element = $(el).get()
        music.push({
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

    for (let i in music) {
        const arr = []
        $(music[i].artists.members).find('a').map((i, el) => {
            arr.push({
                name: $(el.children).text(),
                link: el.attribs.href
            })
        })
        music[i].artists.members = arr
    }

    return res.json({
        artists: artists,
        music: music
    })
})

module.exports = searchRoutes