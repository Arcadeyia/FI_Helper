const fs = require('node:fs')
const process = require('node:process')

// Erstellt nicht Vorhandene Ordner für die klasse

function erstelleordner(klassenzimmer) {
  // Setzt den Pfad für die Stundenpläne
  const pfad_stundenplan = `${process.cwd()}/Javascript/data/${klassenzimmer}/stundenplan`
  // Setzt den Pfad für die Berichtshefte
  const pfad_berichtsheft = `${process.cwd()}/Javascript/data/${klassenzimmer}/berichtsheft`
  // Wenn der pfad nicht existiert
  if (!fs.existsSync(pfad_stundenplan)) {
    console.log(`Ordner für ${klassenzimmer} Stundenplan nicht vorhanden! Erstelle...`)
    // Erstelle diesen
    fs.mkdirSync(pfad_stundenplan, { recursive: true })
  }
  // Wenn der pfad nicht existiert
  if (!fs.existsSync(pfad_berichtsheft)) {
    console.log(`Ordner für ${klassenzimmer} Berichtsheft nicht vorhanden! Erstelle...`)
    // Erstelle diesen
    fs.mkdirSync(pfad_berichtsheft, { recursive: true })
  }
}

module.exports = erstelleordner
