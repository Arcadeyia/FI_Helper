const process = require('node:process')
const fs = require('node:fs')
const downloader = require('./functions/downloader.js')
const hash = require('./functions/hashvergleich.js')
const pdfkonverter = require('./functions/pdfkonverter.js')

class Klassenzimmer {
  constructor(klassenzimmer, cfg, client) {
    this.klasse = klassenzimmer
    this.cfg = cfg
    this.client = client
  }

  sendeAlleDokumente(type, user) {
    const packete = []
    let packet = []
    let count = 0
    fs.readdirSync(`${process.cwd()}/Javascript/data/${this.klasse}/${type}`).forEach((file) => {
      count++
      packet.push(`${process.cwd()}/Javascript/data/${this.klasse}/${type}/${file}`)
      if (count === 10) {
        packete.push(packet)
        packet = []
        count = 0
      }
    })
    packete.push(packet)

    count = 0
    for (const packet of packete) {
      count++
      user.send({
        content: `Verfügbare ${type} Seite: ${count}/${packete.length}`,
        files: packet,
      })
    }
  }

  sendeWochenDokumente(type, user, woche, jahr) {
    const packete = []
    let packet = []
    let count = 0
    fs.readdirSync(`${process.cwd()}/Javascript/data/${this.klasse}/${type}`).forEach((file) => {
      if (file.includes(`KW${woche}`) && file.includes(`${this.klasse}_${jahr}`)) {
        count++
        packet.push(`${process.cwd()}/Javascript/data/${this.klasse}/${type}/${file}`)
      }

      if (count === 10) {
        packete.push(packet)
        packet = []
        count = 0
      }
    })
    packete.push(packet)

    count = 0
    for (const packet of packete) {
      count++
      user.send({
        content: `Verfügbare Dokumente Seite: ${count}/${packete.length}`,
        files: packet,
      })
    }
  }

  downloadeStundenplan(woche, jahr) {
    const url = `https://service.viona24.com/stpusnl/daten/US_IT_2023_Sommer_Aug_${this.klasse}_${jahr}_abKW${woche}.pdf`
    downloader(url, `${process.cwd()}/Javascript/data/${this.klasse}/stundenplan/temp.pdf`).then(pfad =>
      this.vergleicheVorhandeneDateien(pfad, woche, jahr),
    )
  }

  downloadeAttachment(type, url, woche, jahr) {
    downloader(url, `${process.cwd()}/Javascript/data/${this.klasse}/${type}/temp.pdf`).then(pfad =>
      this.vergleicheVorhandeneDateien(pfad, woche, jahr),
    )
  }

  vergleicheVorhandeneDateien(pfad, woche, jahr) {
    console.log(`${this.client.user.username} Vergleiche vorhandene Dateien...`)
    let count = 1
    const datei_pfad = pfad.replace('temp.pdf', '')
    fs.readdirSync(datei_pfad).forEach((file) => {
      if (file !== 'temp.pdf' && file.includes(`KW${woche}`)) {
        if (!(hash(pfad, `${datei_pfad}${file}`))) {
          count++
        }
        else {
          console.log(`${this.client.user.username} Gleiche Datei gefunden! Lösche...`)
          fs.unlinkSync(pfad, (err) => {
            if (err)
              console.log(err)
          })
        }
      }
    })

    if (fs.existsSync(pfad)) {
      const name = `US_IT_2023_Sommer_Aug_${this.klasse}_${jahr}_abKW${woche}_${count}`
      console.log(`${this.client.user.username} Datei nicht vorhanden! Speichere...`)
      const neu_pfad = `${datei_pfad}${name}.pdf`
      fs.renameSync(pfad, neu_pfad, (err) => {
        if (err)
          console.log(err)
      })

      let channelID = null
      let type = null

      if (datei_pfad.includes('berichtsheft')) {
        channelID = this.cfg.berichtsheftchannelID
        type = 'Berichtsheft'
      }
      else {
        channelID = this.cfg.stundenplanchannelID
        type = 'Stundenplan'
      }

      pdfkonverter(neu_pfad, name).then(async (pfad) => {
        await this.client.channels.cache.get(channelID).send({
          content: `${type} von Woche ${woche} für ${jahr} verfügbar!`,
          files: [neu_pfad, pfad],
        })

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
