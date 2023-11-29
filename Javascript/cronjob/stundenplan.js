const cron = require('node-cron')
const woche = require('../functions/woche')

function cronjob(client, klassenliste) {
  cron.schedule('0,30 * * * *', () => {
    const jahr = new Date().getFullYear()
    console.log(`${client.user.username} Starte Cronjob...`)
    for (const klasse in klassenliste)
      klassenliste[klasse].downloadeStundenplan(woche(), jahr)
  })

  cron.schedule('15,45 * * * 5,6,0', () => {
    const jahr = new Date().getFullYear()
    console.log(`${client.user.username} Starte Cronjob...`)
    console.log('Downloading Schedule...')

    for (const klasse in klassenliste)
      klassenliste[klasse].downloadeStundenplan(woche() + 1, jahr)
  })
}

module.exports = cronjob
