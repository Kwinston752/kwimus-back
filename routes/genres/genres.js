const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')

const genresRoutes = express.Router()

// Utils
const decodeUrl = require('./../../utils/decodeUrl')

genresRoutes.get('/popular/get', async (req, res) => {
    const page = await unirest.get('https://sefon.pro/genres/')
    const $ = cheerio.load(page.body)
    const result = []

    $('.b_genre').get().map(el => {
        const element = $(el).get()
        result.push({
            link: $(element).attr('href'),
            title: $(element).text().replace('# ', '').trim()
        })
    })

    return res.json(result.slice(0, 9))
})

genresRoutes.get('/:genre', async (req, res) => {
    const genre = req.params.genre
    const page = await unirest.get(`https://sefon.pro/genres/${genre}`)
    const $ = cheerio.load(page.body)

    const genreTitle = $('.main .hx_social .line h1').text().trim()
    const artists = []
    const newSongs = []
    const topSongs = []

    $('.b_list_artists .ul.only_one_line .li').get().slice(0, 7).map(el => {
        const element = $(el).get()
        artists.push({
            name: $(element).find('span.name').text(),
            link: $(element).find('a').attr('href').replace('https://sefon.me/', ''),
            img: `https://sefon.pro${$(element).find('img').attr('src') ? $(element).find('img').attr('src') : $(element).find('img').attr('data-src')}`
        })
    })

    $('.main .b_lists_mp3s.years.ul .li:nth-child(1) .mp3').get().map(el => {
        const element = $(el).get()
        newSongs.push({
            id: $(element).find('.btns span').attr('data-key'),
            title: $(element).find('.song_name a').text(),
            artists: {
                title: $(element).find('.artist_name').text(),
                members: $(element).find('.artist_name')
            },
            // songLink: $(element).find('.song_name a').attr('href'),
            duration: $(element).find('.duration .value').text(),
            link: decodeUrl($(element).find('.btns span').attr('data-url'), $(element).find('.btns span').attr('data-key'))
        })
    })
    $('.main .b_lists_mp3s.years.ul .li:nth-child(2) .mp3').get().map(el => {
        const element = $(el).get()
        topSongs.push({
            id: $(element).find('.btns span').attr('data-key'),
            title: $(element).find('.song_name a').text(),
            artists: {
                title: $(element).find('.artist_name').text(),
                members: $(element).find('.artist_name')
            },
            // songLink: $(element).find('.song_name a').attr('href'),
            duration: $(element).find('.duration .value').text(),
            link: decodeUrl($(element).find('.btns span').attr('data-url'), $(element).find('.btns span').attr('data-key'))
        })
    })

    for (let i in newSongs) {
        const arr = []
        $(newSongs[i].artists.members).find('a').map((i, el) => {
            arr.push({
                name: $(el.children).text(),
                link: el.attribs.href
            })
        })
        newSongs[i].artists.members = arr
    }

    for (let i in topSongs) {
        const arr = []
        $(topSongs[i].artists.members).find('a').map((i, el) => {
            arr.push({
                name: $(el.children).text(),
                link: el.attribs.href
            })
        })
        topSongs[i].artists.members = arr
    }

    return res.send({
        title: genreTitle,
        artists,
        newSongs,
        topSongs
    })
})

module.exports = genresRoutes