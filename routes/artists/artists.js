const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')

const artistRoutes = express.Router()

artistRoutes.get('/popular', async (req, res) => {
    const page = await unirest.get('https://sefon.pro/')
    const $ = cheerio.load(page.body)
    const result = []

    $('.b_list_artists .ul.only_one_line .li').get().map(el => {
        const element = $(el).get()
        result.push({
            name: $(element).find('span.name').text(),
            link: $(element).find('a').attr('href'),
            img: $(element).find('img').attr('src') ? $(element).find('img').attr('src') : $(element).find('img').attr('data-src')
        })
    })

    return res.json(result.slice(0, 7))
})

artistRoutes.get('/get/:artist', async (req, res) => {
    const page = await unirest.get(`https://sefon.pro/artist/${req.params.artist}`)
    const $ = cheerio.load(page.body)

    const response = {}

    response["name"] = $(".b_artist_info h1[itemprop='name']").text()
    response["image"] = $(".b_artist_info img").attr().src
    response["tracksCount"] = $(".b_artist_info span[itemprop='numTracks']").text()

    return res.json(response)
})

const decodeUrl = (url, key) => {
    url = url.replace('#', '')

    key = key.split('').reverse().join('')
    let data = url
    for (let x of key) {
        data = data.split(x).reverse().join(x)
    }

    return Buffer.from(data, 'base64').toString()
}

artistRoutes.get('/get/:artist/music', async (req, res) => {
    const page = await unirest.get(`https://sefon.pro/artist/${req.params.artist}`)
    const $ = cheerio.load(page.body)

    const response = []

    $('.content .mp3').get().map(el => {
        const element = $(el).get()
        response.push({
            artists: {
                title:$(element).find('.artist_name').text(),
                members: $(element).find('.artist_name')
            },
            songInfo: {
                title: $(element).find('.song_name a').text(),
                link: $(element).find('.song_name a').attr('href')
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

module.exports = artistRoutes