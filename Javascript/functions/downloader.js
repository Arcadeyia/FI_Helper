const https = require('node:https')
const fs = require('node:fs')

function downloadDatei(url, pfad) {
  console.log(`Starte download für ${url}`)
  const file = fs.createWriteStream(pfad)
  return new Promise((resolve, reject) => {
    try {
      https.get(url, (response) => {
        if (response.statusCode !== 200)
          return console.log('Datei nicht gefunden')

        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Download für ${url} abgeschlossen.`)
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
