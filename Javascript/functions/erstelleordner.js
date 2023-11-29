const fs = require('node:fs')
const process = require('node:process')

function erstelleordner(klassenzimmer) {
  const pfad_stundenplan = `${process.cwd()}/Javascript/data/${klassenzimmer}/stundenplan`
  const pfad_berichtsheft = `${process.cwd()}/Javascript/data/${klassenzimmer}/berichtsheft`
  if (!fs.existsSync(pfad_stundenplan)) {
    console.log(`Ordner für ${klassenzimmer} Stundenplan nicht vorhanden! Erstelle...`)
    fs.mkdirSync(pfad_stundenplan, { recursive: true })
  }

  if (!fs.existsSync(pfad_berichtsheft)) {
    console.log(`Ordner für ${klassenzimmer} Berichtsheft nicht vorhanden! Erstelle...`)
    fs.mkdirSync(pfad_berichtsheft, { recursive: true })
  }
}

module.exports = erstelleordner
