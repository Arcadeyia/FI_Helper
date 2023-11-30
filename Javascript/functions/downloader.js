const https = require('node:https')
const fs = require('node:fs')

// Downloaded eine Datei
function downloadDatei(url, pfad) {
  console.log(`Starte download für ${url}`)
  // Erstellt den Speicherpfad
  const file = fs.createWriteStream(pfad)
  // Erstellt ein Promise
  return new Promise((resolve, reject) => {
    try {
      // Fragt via HTTPS die Url an
      https.get(url, (response) => {
        // Falls Statuscode nicht 200 ist
        if (response.statusCode !== 200)
        // Error
          return console.log('Datei nicht gefunden')

        // Speichert die Antwort(Datei) im Speicherpfad
        response.pipe(file)
        // Wenn der Download fertig ist
        file.on('finish', () => {
          // Schließe die datei
          file.close()
          console.log(`Download für ${url} abgeschlossen.`)
          // Gibt den Pfad wieder via Promise
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
