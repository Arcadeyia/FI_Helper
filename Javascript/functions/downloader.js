const https = require('node:https')
const fs = require('node:fs')

function downloadDatei(url, pfad) {
  const file = fs.createWriteStream(pfad)
  return new Promise((resolve, reject) => {
    try {
      https.get(url, (response) => {
        if (response.statusCode !== 200)
          return console.log('Datei nicht gefunden')

        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Download für ${pfad} abgeschlossen.`)
          resolve(pfad)
        })
      })
    }
    catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = downloadDatei
