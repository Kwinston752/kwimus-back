const express = require('express')

const unirest = require('unirest')
const cheerio = require('cheerio')

// Utils
const decodeUrl = require('./../../utils/decodeUrl')

const artistRoutes = express.Router()



artistRoutes.get('/popular-short', async (req, res) => {
    const page = await unirest.get('http://sefon.pro/')

    const $ = cheerio.load(page.body)
    const result = []

    $('.b_list_artists .ul.only_one_line .li').get().map(el => {
        const element = $(el).get()
        result.push({
            name: $(element).find('span.name').text(),
            link: $(element).find('a').attr('href').replace('https://sefon.me/', ''),
            img: `https://sefon.pro${$(element).find('img').attr('src') ? $(element).find('img').attr('src') : $(element).find('img').attr('data-src')}`
        })
    })

    return res.json(result.slice(0, 7))
})


artistRoutes.get('/popular-full', async (req, res) => {
    const page = await unirest.get('https://sefon.pro/artists/')

    const $ = cheerio.load(page.body)
    const result = []

    $('.b_list_artists .ul .li').get().map(el => {
        const element = $(el).get()
        result.push({
            name: $(element).find('span.name').text(),
            link: $(element).find('a').attr('href').replace('https://sefon.me/', ''),
            img: $(element).find('img').attr('src') ? $(element).find('img').attr('src') : $(element).find('img').attr('data-src')
        })
    })

    return res.json(result)
})


artistRoutes.get('/get/:artist', async (req, res) => {
    const page = await unirest.get(`https://sefon.pro/artist/${req.params.artist}`)
    const $ = cheerio.load(page.body)

    if ($(".b_error_page").length > 0) {
        res.statusCode = 204
        return res.send("")
    }
 
    const response = {}

    response["name"] = $(".b_artist_info h1[itemprop='name']").text()

    const img = $(".b_artist_info img").attr()?.src

    response["img"] = img ? `https://sefon.pro${img}` : 'https://media.istockphoto.com/vectors/missing-image-of-a-person-placeholder-vector-id1288129985?k=20&m=1288129985&s=612x612&w=0&h=OHfZHfKj0oqIDMl5f_oRqH13MHiB63nUmySYILbWbjE='
    response["tracksCount"] = Number($(".b_artist_info span[itemprop='numTracks']").text())
    response["genre"] = {
        link: $('.main .b_badges a').attr('href').replace('/top/artists/', ''),
        title: $('.main .b_badges a').text().replace( /\s/g, '')
    }

    return res.json(response)
})


artistRoutes.get('/get-similar-artists/:artist', async (req, res) => {
    const page = await unirest.get(`https://sefon.pro/artist/${req.params.artist}`)
    const $ = cheerio.load(page.body)

    if ($(".b_error_page").length > 0) {
        res.statusCode = 204
        return res.send("")
    }

    const response = []

    $('#similar .b_list_artists .ul .li').get().map(el => {
        const element = $(el).get()
        const link = $(element).find('a').attr('href')
        const img = link.replace('/artist/', '').split('-').splice(1).join('-').replace('/', '')

        response.push({
            title: $(element).find('.info .name').text(),
            img: `https://sefon.pro/img/artist_photos/${img}.jpg`,
            link
        })
    })

    return res.json(response)
})


artistRoutes.get('/get/:artist/music/:pageNumber', async (req, res) => {
    const page = await unirest.get(`https://sefon.pro/artist/${req.params.artist}/${req.params.pageNumber}`)
    const $ = cheerio.load(page.body)

    const response = []

    $('.mp3[itemprop="track"]').get().map(el => {
        const element = $(el).get()
        response.push({
            id: $(element).find('.btns span').attr('data-key'),
            title: $(element).find('.song_name a').text(),
            artists: {
                title: $(element).find('.artist_name').text(),
                members: $(element).find('.artist_name')
            },
            songLink: $(element).find('.song_name a').attr('href'),
            duration: $(element).find('.duration .value').text(),
            link: decodeUrl($(element).find('.btns span').attr('data-url'), $(element).find('.btns span').attr('data-key'))
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
