const process = require('node:process')
const { fromPath } = require('pdf2pic')

// Konvertierung einer PDF datei zu PNG
function pdfKonverter(file, name) {
  // Speicherpfad
  const dir = `${process.cwd()}/Javascript`
  // PNG Optionen
  const options = {
    density: 100,
    saveFilename: name,
    savePath: dir,
    format: 'png',
  }
  const convert = fromPath(file, options)
  const pageToConvertAsImage = 1
  // Erstellt ein Promise
  return new Promise((myResolve) => {
    // Konvertiert die Datei
    convert(pageToConvertAsImage, { responseType: 'image' })
      .then((resolve) => {
        console.log(`Erfolgreich Konvertiert:${file}`)
        // Gibt den Pfad wieder als Promise
        myResolve(resolve.path)
      })
  })
}
module.exports = pdfKonverter
