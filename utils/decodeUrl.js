module.exports = (url, key) => {
    url = url.replace('#', '')

    key = key.split('').reverse().join('')
    let data = url
    for (let x of key) {
        data = data.split(x).reverse().join(x)
    }

    return Buffer.from(data, 'base64').toString()
}