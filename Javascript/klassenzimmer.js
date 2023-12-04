const process = require('node:process')
const fs = require('node:fs')
const downloader = require('./functions/downloader.js')
const hash = require('./functions/hashvergleich.js')
const pdfkonverter = require('./functions/pdfkonverter.js')
// Erstellung der JS Klasse
class Klassenzimmer {
  // Initialisierungs Variablen
  constructor(klassenzimmer, cfg, client) {
    this.klasse = klassenzimmer
    this.cfg = cfg
    this.client = client
  }

  // Sendet alle Dokumente des Typen dem User
  sendeAlleDokumente(type, user) {
    // Setze variablen
    const packete = []
    let packet = []
    let count = 0
    // Für jede datei im pfad
    fs.readdirSync(`${process.cwd()}/Javascript/data/${this.klasse}/${type}`).forEach((file) => {
      // Erhöhe count
      count++
      // Setze pfad in den array
      packet.push(`${process.cwd()}/Javascript/data/${this.klasse}/${type}/${file}`)
      // Wenn 10 im array sind
      if (count === 10) {
        // Setzte das komplette array in ein anderes array
        packete.push(packet)
        // Resette das Array und Count
        packet = []
        count = 0
      }
    })
    // Packt das letzte mal das Array in das andere Array
    packete.push(packet)

    count = 0
    // Für jedes Packet in Packete
    for (const packet of packete) {
      count++
      // Sendet das packet dem user
      user.send({
        content: `Verfügbare ${type} Seite: ${count}/${packete.length}`,
        files: packet,
      })
    }
  }

  // Sendet alle Dokumente des Typen einer bestimmten woche dem User
  sendeWochenDokumente(type, user, woche, jahr) {
    // Setze variablen
    const packete = []
    let packet = []
    let count = 0
    fs.readdirSync(`${process.cwd()}/Javascript/data/${this.klasse}/${type}`).forEach((file) => {
      // Wenn die datei von der woche ist und von der klasse mit dem selben jahr
      if (file.includes(`KW${woche}`) && file.includes(`${this.klasse}_${jahr}`)) {
        // Erhöhe count
        count++
        // Setze pfad in den array
        packet.push(`${process.cwd()}/Javascript/data/${this.klasse}/${type}/${file}`)
      }
      // Wenn 10 im array sind
      if (count === 10) {
        // Setzte das komplette array in ein anderes array
        packete.push(packet)
        // Resette das Array und Count
        packet = []
        count = 0
      }
    })
    // Packt das letzte mal das Array in das andere Array
    packete.push(packet)

    count = 0
    // Für jedes Packet in Packete
    for (const packet of packete) {
      count++
      // Sendet das packet dem user
      user.send({
        content: `Verfügbare Dokumente Seite: ${count}/${packete.length}`,
        files: packet,
      })
    }
  }

  // Downloade den Stundenplan
  downloadeStundenplan(woche, jahr) {
    const url = `https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_${this.klasse}_${jahr}_abKW${woche}.pdf`
    // Downloade die datei
    downloader(url, `${process.cwd()}/Javascript/data/${this.klasse}/stundenplan/temp.pdf`).then(pfad =>
      // Vergleiche die datei
      this.vergleicheVorhandeneDateien(pfad, woche, jahr),
    ).catch((err)=>{
      console.log(err)
    })
  }

  // Donwloaded den Anhang beim Hochladen
  downloadeAttachment(type, url, woche, jahr) {
    // Downloade die datei
    downloader(url, `${process.cwd()}/Javascript/data/${this.klasse}/${type}/temp.pdf`).then(pfad =>
      // Vergleiche die datei
      this.vergleicheVorhandeneDateien(pfad, woche, jahr),
    ).catch((err) => {
      console.log(err)
    })
  }

  // Vergleicht die Daten ob doppelte vorhanden sind und passt den index an
  vergleicheVorhandeneDateien(pfad, woche, jahr) {
    console.log(`${this.client.user.username} Vergleiche vorhandene Dateien...`)
    let count = 1
    // Entferne temp.pdf um den Pfad zu kriegen
    const datei_pfad = pfad.replace('temp.pdf', '')
    // Für jede datei im pfad
    fs.readdirSync(datei_pfad).forEach((file) => {
      // Wenn die datei nicht temp.pdf ist und von der woche stammt
      if (file !== 'temp.pdf' && file.includes(`KW${woche}`)) {
        // Wenn die hashes der dateien sich unterscheiden
        if (!(hash(pfad, `${datei_pfad}${file}`))) {
          // Erhöhe index
          count++
        }
        else {
          console.log(`${this.client.user.username} Gleiche Datei gefunden! Lösche...`)
          // Entfernt die temp.pdf vom System
          fs.unlinkSync(pfad, (err) => {
            if (err)
              console.log(err)
          })
        }
      }
    })
    // Wenn die temp.pdf noch vorhanden ist
    if (fs.existsSync(pfad)) {
      // Setze namen der datei
      const name = `US_IT_2023_Sommer_Aug_${this.klasse}_${jahr}_abKW${woche}_${count}`
      console.log(`${this.client.user.username} Datei nicht vorhanden! Speichere...`)
      // Setzte den pfad der datei
      const neu_pfad = `${datei_pfad}${name}.pdf`
      // Speichere die temp.pdf neu ab
      fs.renameSync(pfad, neu_pfad, (err) => {
        if (err)
          console.log(err)
      })

      let channelID = null
      let type = null
      // Setzte channel und type anhand des pfades
      if (datei_pfad.includes('berichtsheft')) {
        channelID = this.cfg.berichtsheftchannelID
        type = 'Berichtsheft'
      }
      else {
        channelID = this.cfg.stundenplanchannelID
        type = 'Stundenplan'
      }
      // Erstelle PNG für die Preview
      pdfkonverter(neu_pfad, name).then(async (pfad) => {
        // Sendet die PDF und die PNG dem User
        await this.client.channels.cache.get(channelID).send({
          content: `${type} von Woche ${woche} für ${jahr} verfügbar!`,
          files: [neu_pfad, pfad],
        })
        // Entfernt die PNG vom System
        fs.unlinkSync(pfad, (err) => {
          if (err)
            console.log(err)
        })
      })
    }
    console.log(`${this.client.user.username} Vergleiche Abgeschlossen`)
  }
}

module.exports = Klassenzimmer
