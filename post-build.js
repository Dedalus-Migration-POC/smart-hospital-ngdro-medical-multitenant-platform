/* global process, indexHtmlFile  */

const fs = require('fs')
const pjson = require('./package.json')

const appTitle = pjson.name
const appVersion = pjson.version

let args = process.argv.slice(2)
let deployUrl = args[0]
deployUrl = deployUrl.endsWith('/') ? deployUrl.slice(0, -1) : deployUrl

const environmentValue = 'Dedalus group company'
const indexHtmlFile = './dist/index.html'

fs.readFile(indexHtmlFile, 'utf8', function (err, indexHtmlFileData) {
    if (err) {
        console.log(err)
        return
    }

    const result = `<!-- ${appTitle} v.`
        .concat(appVersion)
        .concat(' - ')
        .concat(new Date().toUTCString())
        .concat(` - by ${environmentValue} -->\n`)
        .concat(indexHtmlFileData)
    fs.writeFile(indexHtmlFile, result, 'utf8', function (err) {
        if (err) return console.log(err)
    })
})