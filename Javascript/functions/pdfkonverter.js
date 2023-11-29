const fs = require('node:fs')
const process = require('node:process')
const pdf = require('pdf-poppler')

function pdfKonverter(file, name) {
  const dir = `${process.cwd()}/Javascript/data`
  const opts = {
    format: 'png',
    out_dir: dir,
    out_prefix: name,
    page: false,
  }

  return new Promise((myResolve, myReject) => {
    pdf.convert(file, opts)
      .then(() => {
        const pfad = `${dir}/${name.replace('-1', '')}.png`
        fs.renameSync(`${dir}/${name}-1.png`, pfad)
        console.log('Erfolgreich Konvertiert')
        myResolve(pfad)
      })
      .catch((error) => {
        console.error(error)
        myReject(error)
      })
  })
}
module.exports = pdfKonverter
